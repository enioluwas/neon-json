#[macro_use]
extern crate neon;
extern crate neon_serde;
extern crate serde_json;

use neon::js::error::{JsError, Kind};
use neon::js::{Object, JsString, JsValue, JsFunction, JsObject, JsNull};
use neon::vm::{Call, JsResult};
use neon::mem::Handle;
use neon::scope::RootScope;

fn parse(call: Call) -> JsResult<JsObject>
{
    let scope = call.scope;
    let args_len = call.arguments.len();

    let js_string = call.arguments.require(scope, 0)?.check::<JsString>()?;

    let js_object: serde_json::Value = serde_json::from_str(&js_string.value())
        .or_else(|err| {
            JsError::throw(Kind::Error, &err.to_string())
        })?;

    let js_object = neon_serde::to_value(scope, &js_object)?.check::<JsObject>()?;

    let _obj = js_object;

    if args_len > 1
        {
            let js_reviver = call.arguments
                .require(scope, 1)?
                .check::<JsFunction>()?;

            let _obj = call_reviver(scope, js_object, js_reviver)?;
        }

    Ok(_obj)
}

fn call_reviver<'a>(scope: &'a mut RootScope, obj: Handle<'a, JsObject>, reviver: Handle<'a, JsFunction>) -> JsResult<'a, JsObject>
{
    let obj_keys = obj.get_own_property_names(scope)?
        .to_vec(scope)?;

    for key in obj_keys
        {
            let old_val = obj.get(scope, key).unwrap();
            if old_val.is_a::<JsObject>()
            {
                obj.set(key, call_reviver(scope, old_val.check::<JsObject>()?, reviver)?)?;
            }
            else
            {
                let args = vec![key, old_val];
                let new_val = reviver.call(scope, JsNull::new(), args.into_iter())?;
                obj.set(key, new_val)?;
            }
        }

    Ok(obj)
}

fn stringify(call: Call) -> JsResult<JsString>
{
    let scope = call.scope;
    let js_object = call.arguments.require(scope, 0)?.check::<JsValue>()?;

    let js_object: serde_json::Value = neon_serde::from_value(scope, js_object)?;
    let js_string = serde_json::to_string(&js_object)
        .or_else(|err| {
            JsError::throw(Kind::Error, &err.to_string())
        })?;

    JsString::new_or_throw(scope, &js_string)
}

register_module!(m, 
    {
        m.export("parse", parse)?;
        m.export("stringify", stringify)?;

        Ok(())
    });