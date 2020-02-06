# Proton-version

Create a new version and detects if there is a new version available for you dependencies.
It will:
  - detect and ask you if we need to updat them
  - commit the new lockfile
  - run npm version


> Auto detect them via the package.json

## API
```sh
$ proton-version <patch|minor|major>
```

### Flags

- `--verbose`: verbose :)
- `--all`: Auto update all dependencies from proton
- `--help`: Display the help
- `--custom-versio <value>`: Custom version _must be valid semver_
