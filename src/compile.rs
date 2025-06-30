use crate::ast::*;
use std::collections::HashMap;

/*
    1. Pure Push
    - Don't see the stack item.
    - Push new single stack item.
*/

// OP_0...OP_16, OP_1NEGATE, and other int in range of [-2147483647, 2147483647].
// Reference: <https://github.com/bitcoin/bips/blob/master/bip-0062.mediawiki#numbers>
pub fn push_int() {}

// Push any type of byte. Some are overlapped with push_int.
// Reference: <https://github.com/bitcoin/bips/blob/master/bip-0062.mediawiki#push-operators>
pub fn push_bytes() {}

/*
    2. Control Push
    - See the top 1 stack item.
*/

// OP_IF, OP_NOTIF, OP_ELSE, OP_ENDIF, and OP_VERIFY.
pub fn push_control() {}

/*
    3. Length push
    - See the top 1 stack item.
    - Push new single stack item.
*/

// OP_SIZE.
pub fn push_bytes_len() {}

/*
    4. Compare push
    - See the top 2 stack item.
    - Pop the top 2 stack item.
    - Push new single stack item.
*/

// OP_EQUAL, OP_BOOLAND, OP_BOOLOR, (OP_NUMEQUAL, OP_NUMNOTEQUAL,)
// OP_LESSTHAN, OP_GREATERTHAN, OP_LESSTHANOREQUAL, and OP_GREATERTHANOREQUAL.
pub fn push_compare() {}

/*
    4. Math push unary
    - See the top 1 stack item.
    - Pop the top 1 stack item.
    - Push new single stack item.
*/

// OP_1ADD, OP_1SUB, OP_NEGATE, OP_ABS, OP_NOT, (and OP_0NOTEQUAL).
pub fn push_math_unary() {}

/*
    5. Math push binary
    - See the top 2 stack item.
    - Pop the top 2 stack item.
    - Push new single stack item.
*/

// OP_ADD, OP_SUB, OP_MIN, OP_MAX
pub fn push_math_binary() {}

/*
    6. Math push ternary
    - See the top 3 stack item.
    - Pop the top 3 stack item.
    - Push new single stack item.
*/

// OP_WITHIN
pub fn push_math_ternary() {}

/*
    7. Crypto push
    - See the top 1 stack item.
    - Pop the top 1 stack item.
    - Push new single stack item.
*/

// OP_RIPEMD160, OP_SHA1, OP_SHA256, OP_HASH160, OP_HASH256,
// OP_CHECKSIG, OP_CHECKMULTISIG, OP_CHECKSIGADD
pub fn push_crypto() {}

/*
    8. Locktime push
    - See the top 1 stack item.
    - Pop the top 1 stack item.
*/

// OP_CHECKLOCKTIMEVERIFY and OP_CHECKSEQUENCEVERIFY
pub fn push_locktime() {}

// From compiled opcodes, add stack ops or re-order opcodes.
pub fn stack_resolver() {}

// From compiled opcodes, optimize opcodes.
// e.g. OP_EQUAL + OP_VERIFY => OP_EQUALVERIFY
pub fn opcode_optimizer() {}

pub fn stack_table(stack: Vec<StackParam>) -> HashMap<String, Type> {
    let mut stack_table: HashMap<String, Type> = HashMap::new();

    for input in stack {
        stack_table.insert(input.identifier.0, input.ty);
    }

    stack_table
}

pub fn compile(ast: Vec<Statement>) {
    let script = bitcoin::Script::builder();
}

pub fn test_bitcoin() {
    let byte = [16; 1];
    let a = bitcoin::Script::builder().push_slice(byte);
    let b = bitcoin::Script::builder().push_int(4);

    println!("{:?}", a.as_bytes());
    println!("{:?}", b.as_bytes());
}
