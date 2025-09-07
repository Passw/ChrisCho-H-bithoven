use crate::ast::*;

trait Locatable {
    fn loc_mut(&mut self) -> &mut Location;
}

impl Locatable for Statement {
    fn loc_mut(&mut self) -> &mut Location {
        match self {
            // For struct variants with a named `loc` field
            Statement::IfStatement { loc, .. } => loc,
            Statement::LocktimeStatement { loc, .. } => loc,

            // For tuple-struct variants, access by index
            Statement::VerifyStatement(loc, ..) => loc,
            Statement::ExpressionStatement(loc, ..) => loc,
        }
    }
}

// 1. Get line and column for each statement's location(span)

/// Builds an index of the starting byte offset for each line in the source code.
/// This should be called only once per source file for efficiency.
pub fn build_line_index(source: &str) -> Vec<usize> {
    std::iter::once(0)
        .chain(source.match_indices('\n').map(|(i, _)| i + 1))
        .collect()
}

/// Finds the 1-based line and column numbers for a given byte offset
/// using a pre-built line index.
pub fn get_line_and_column(line_index: &[usize], byte_offset: usize) -> (usize, usize) {
    let line = line_index
        .iter()
        .rposition(|&start| start <= byte_offset)
        .map_or(1, |i| i + 1);
    let column = byte_offset - line_index[line - 1] + 1;
    (line, column)
}

/// Recursively walks the AST and populates the line and column numbers.
pub fn set_stmt_location(ast: &mut Vec<Statement>, line_index: &[usize]) {
    for stmt in ast {
        // Get a mutable reference to the location using our new trait method.
        let loc = stmt.loc_mut();

        // Perform the update logic once.
        let (line, column) = get_line_and_column(line_index, loc.start);
        loc.line = line;
        loc.column = column;

        // recursive
        if let Statement::IfStatement {
            if_block,
            else_block,
            ..
        } = stmt
        {
            set_stmt_location(if_block, line_index);
            if let Some(else_b) = else_block.as_mut() {
                set_stmt_location(else_b, line_index);
            }
        }
    }
}

// 2. Remove all the comments from source code
use lazy_static::lazy_static;
use regex::Regex;

/// Removes all single-line (`//`) and multi-line (`/* ... */`) comments from a source string.
pub fn strip_comments(source: &str) -> String {
    lazy_static! {
        // This regex pattern finds both single-line and multi-line comments.
        // It correctly handles nested asterisks in multi-line comments.
        static ref COMMENT_REGEX: Regex = Regex::new(r"(//[^\n\r]*)|(/\*[^*]*\*+(?:[^/*][^*]*\*+)*/)").unwrap();
    }
    COMMENT_REGEX.replace_all(source, "").to_string()
}
