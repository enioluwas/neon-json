#[macro_use]
extern crate neon;
extern crate neon_serde;
extern crate serde_json;

use neon::js::error::{JsError, Kind};
use neon::js::{JsString, JsValue};
use neon::vm::{Call, JsResult};

fn parse(call: Call) -> JsResult<JsValue>
{
    let scope = call.scope;
    let string = call.arguments
        .require(scope, 0)?
        .check::<JsString>()?;

    let object: serde_json::Value = serde_json::from_str(&string.value())
        .or_else(|err| JsError::throw(Kind::Error, &err.to_string()))?;

    let object = neon_serde::to_value(scope, &object)?;

    Ok(object)
}

fn stringify(call: Call) -> JsResult<JsString>
{
    let scope = call.scope;
    let object = call.arguments
        .require(scope, 0)?
        .check::<JsValue>()?;

    let object: serde_json::Value = neon_serde::from_value(scope, object)?;
    let string = serde_json::to_string(&object)
        .or_else(|err| JsError::throw(Kind::Error, &err.to_string()))?;

    JsString::new_or_throw(scope, &string)
}

register_module!(m, 
    {
        m.export("parse", parse)?;
        m.export("stringify", stringify)?;

        Ok(())
    });