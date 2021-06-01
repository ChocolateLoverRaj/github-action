# github-action

![Created with ](https://img.shields.io/badge/Created%20with-@programmerraj/create-3cb371?style=flat)
[![TS-Standard - Typescript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/standard/ts-standard)

## What This Does
Outputs `str`, which is the input `str` capitalized.

## Usage
The example will output `PYTHON IS BAD.`
```yaml
name: Workflow Name
# ...
jobs:
  job_name:
    # ...
    steps:
      - name: Setup Pnpm
        uses: pnpm/action-setup@v2.0.1
        with:
          version: 6.4
      # ...
      - name: Test Self
        uses: ./
        with:
          str: 'Python is bad.'
        id: test_self
      - run: 'echo ${{ steps.test_self.outputs.str }}'
```
      