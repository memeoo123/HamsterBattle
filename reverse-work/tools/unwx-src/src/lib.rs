pub mod decoder;
pub mod decryptor;
pub mod sinker;

use std::fs;
use std::io;
use std::path::{Path, PathBuf};

use decoder::Decoder;
use decryptor::DecryptorBuilder;
use sinker::Sinker;

/// Options for unpacking a wxapkg file from a path.
pub struct UnpackOptions {
    /// Path to the input `.wxapkg` file.
    pub input: PathBuf,
    /// Output directory.
    pub output: PathBuf,
    /// WeChat app ID for decrypting encrypted packages.
    pub wxid: Option<String>,
}

/// Options for unpacking a wxapkg buffer.
pub struct UnpackBytesOptions<'a> {
    /// The wxapkg data.
    pub buffer: &'a [u8],
    /// Output directory.
    pub output: PathBuf,
    /// WeChat app ID for decrypting encrypted packages.
    pub wxid: Option<String>,
}

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("{0}")]
    Io(#[from] io::Error),
    #[error("cannot infer wxid from path, should set wxid manually")]
    MissingWxid,
}

/// Unpack a wxapkg file to the output directory.
pub fn unpack(options: &UnpackOptions) -> Result<(), Error> {
    let input = options.input.canonicalize()?;
    let data = read_input(&input, options.wxid.as_deref())?;
    write_out(&data, &options.output)
}

/// Unpack a wxapkg buffer to the output directory.
pub fn unpack_bytes(options: &UnpackBytesOptions) -> Result<(), Error> {
    let data = if decryptor::should_decrypt(options.buffer) {
        let wxid = options.wxid.as_deref().ok_or(Error::MissingWxid)?;
        let decryptor = DecryptorBuilder::new()
            .set_wxid(Some(wxid.to_owned()))
            .build()
            .ok_or(Error::MissingWxid)?;
        decryptor.decrypt(options.buffer)?
    } else {
        options.buffer.to_vec()
    };
    write_out(&data, &options.output)
}

fn write_out(data: &[u8], output: &Path) -> Result<(), Error> {
    let sinker = Sinker::new(output);
    let decoder = Decoder::new(data)?;

    rayon::scope(|scope| {
        let sinker = &sinker;
        for file in decoder {
            match file {
                Ok(file) => {
                    scope.spawn(move |_| {
                        if let Err(e) = sinker.write_file(file.name, file.data) {
                            eprintln!("Failed to write file {}\n{e}", file.name);
                        }
                    });
                }
                Err(e) => {
                    eprintln!("Failed to decode file: {e}");
                }
            }
        }
    });

    Ok(())
}

fn read_input(path: &Path, wxid: Option<&str>) -> Result<Vec<u8>, Error> {
    let data = fs::read(path)?;

    if decryptor::should_decrypt(&data) {
        let decryptor = DecryptorBuilder::new()
            .guess_wxid_from_path(path)
            .set_wxid(wxid.map(String::from))
            .build()
            .ok_or(Error::MissingWxid)?;
        Ok(decryptor.decrypt(&data)?)
    } else {
        Ok(data)
    }
}
