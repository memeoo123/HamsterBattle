# unwx

## Get

Download prebuilt binaries from [Releases](https://github.com/unbyte/unwx/releases/latest)

or install using cargo:

```shell
cargo install unwx
```


## Usage

```shell
# unpack to path/to/abc.unpacked/
unwx path/to/abc.wxapkg

# unpack to dest/
unwx path/to/abc.wxapkg -o dest

# clean dest/ before unpack
unwx path/to/abc.wxapkg -o dest --clean

# unpack packages from wechat on windows, with wxid inferred from path
unwx path/to/__APP__.wxapkg

# unpack packages from wechat on windows, specify wxid manually
unwx path/to/__APP__.wxapkg -w wx1234567890
```

## Library

```toml
unwx = { version = "0.3", default-features = false }
```

```rust
// Unpack from a file path
unwx::unpack(&unwx::UnpackOptions {
    input: "path/to/abc.wxapkg".into(),
    output: "path/to/output".into(),
    wxid: None,
})?;

// Unpack from a buffer
unwx::unpack_bytes(&unwx::UnpackBytesOptions {
    buffer: &data,
    output: "path/to/output".into(),
    wxid: None,
})?;
```

## License

MIT License.