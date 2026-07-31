use std::path::PathBuf;
use std::process;
use std::time::Instant;
use std::{fs, io};

fn main() {
    let timer = Instant::now();

    let flags = Flags::from_env_or_exit();
    let input = PathBuf::from(&flags.input);
    let output = flags
        .output
        .map(PathBuf::from)
        .unwrap_or_else(|| input.with_extension("unpacked"));

    if flags.clean
        && let Err(e) = clean_dir(&output)
    {
        eprintln!("{e}");
        process::exit(1);
    }

    let options = unwx::UnpackOptions {
        input,
        output,
        wxid: flags.wxid,
    };

    if let Err(e) = unwx::unpack(&options) {
        eprintln!("{e}");
        eprintln!("Failed in {:?}", timer.elapsed());
        process::exit(1);
    }
    eprintln!("Done in {:?}", timer.elapsed());
}

fn clean_dir(dir: &PathBuf) -> io::Result<()> {
    match fs::remove_dir_all(dir) {
        Ok(_) => Ok(()),
        Err(e) if e.kind() == io::ErrorKind::NotFound => Ok(()),
        Err(e) => Err(e),
    }
}

xflags::xflags! {
    /// unpack wx pkg
    cmd flags {
        /// output directory for unpacked files
        optional -o,--output output: String
        /// clean output directory before write
        optional -c,--clean
        /// wxid of the package
        optional -w, --wxid wxid: String
        /// path to the package
        required input: String
    }
}
