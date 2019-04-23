# neon-json

A native Node module written in Rust for serializing/deserializing JavaScript objects. 

## Why?

This project was created to study the viability of Node modules written in launguages with faster computation speeds. Using the [Neon](https://github.com/neon-bindings/neon) bridge the Rust crate is converted into a Node module. This generates considerable overhead though, and in the context of this project more time is lost in overhead than gained in computational speed. Working with JSON is highly optimized in Node, so this is no surprise. However there are far more complex tasks that I believe will benefit from Native modules like this.

## Functionality

I am no longer actively working on this project but any PRs are welcome.

`JSON.parse(text, reviver)`

- Fully functional

`JSON.stringify(value[, replacer[, spacer]])`
- `value` - fully functional
- `replacer` - only works as a function
- `spacer` - Not implemented
