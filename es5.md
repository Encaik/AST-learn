<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

本文档指定了支持 ES5 语法的核心 ESTree AST 节点类型。

- [Node objects(节点对象)](#node-objects)
- [Identifier(识别)](#identifier)
- [Literal(文字)](#literal)
  - [RegExpLiteral(正则表达式)](#regexpliteral)
- [Programs(程序)](#programs)
- [Functions(函数)](#functions)
- [Statements(声明)](#statements)
  - [ExpressionStatement(表达声明)](#expressionstatement)
  - [BlockStatement(块)](#blockstatement)
  - [EmptyStatement(Empty)](#emptystatement)
  - [DebuggerStatement(Debug)](#debuggerstatement)
  - [WithStatement(与声明)](#withstatement)
  - [Control flow(控制流)](#control-flow)
    - [ReturnStatement(return)](#returnstatement)
    - [LabeledStatement(标签声明)](#labeledstatement)
    - [BreakStatement(break)](#breakstatement)
    - [ContinueStatement(continue)](#continuestatement)
  - [Choice(判断)](#choice)
    - [IfStatement(if)](#ifstatement)
    - [SwitchStatement(switch)](#switchstatement)
      - [SwitchCase(case)](#switchcase)
  - [Exceptions(异常)](#exceptions)
    - [ThrowStatement(throw)](#throwstatement)
    - [TryStatement(try)](#trystatement)
      - [CatchClause(catch)](#catchclause)
  - [Loops(循环)](#loops)
    - [WhileStatement(while)](#whilestatement)
    - [DoWhileStatement(dowhile)](#dowhilestatement)
    - [ForStatement(for)](#forstatement)
    - [ForInStatement(forin)](#forinstatement)
- [Declarations(声明)](#declarations)
  - [FunctionDeclaration(方法声明)](#functiondeclaration)
  - [VariableDeclaration(变量声明)](#variabledeclaration)
    - [VariableDeclarator(变量声明器)](#variabledeclarator)
- [Expressions(表达式)](#expressions)
  - [ThisExpression(this)](#thisexpression)
  - [ArrayExpression(Array)](#arrayexpression)
  - [ObjectExpression(Object)](#objectexpression)
    - [Property(属性)](#property)
  - [FunctionExpression(方法表达式)](#functionexpression)
  - [Unary operations(一元运算)](#unary-operations)
    - [UnaryExpression(一元表达式)](#unaryexpression)
      - [UnaryOperator(一元运算符)](#unaryoperator)
    - [UpdateExpression(更新表达式)](#updateexpression)
      - [UpdateOperator(更新运算符)](#updateoperator)
  - [Binary operations(二元运算)](#binary-operations)
    - [BinaryExpression(二元表达式)](#binaryexpression)
      - [BinaryOperator(二元运算符)](#binaryoperator)
    - [AssignmentExpression(分配表达式)](#assignmentexpression)
      - [AssignmentOperator(分配运算符)](#assignmentoperator)
    - [LogicalExpression(逻辑表达式)](#logicalexpression)
      - [LogicalOperator(逻辑运算符)](#logicaloperator)
    - [MemberExpression(成员表达式)](#memberexpression)
  - [ConditionalExpression(条件表达式)](#conditionalexpression)
  - [CallExpression(call)](#callexpression)
  - [NewExpression(new)](#newexpression)
  - [SequenceExpression(序列表达式)](#sequenceexpression)
- [Patterns(模式)](#patterns)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Node objects

ESTree AST 节点表示为`Node`对象，该对象可以具有任何原型继承，但实现以下接口：

```js
interface Node {
  type: string;
  loc: SourceLocation | null;
}
```

`type`字段是代表 AST 变体类型的字符串。 以下以`type`字段的特定字符串记录`Node`的每个子类型。 您可以使用此字段来确定节点实现的接口。

`loc`字段代表节点的源位置信息。 如果该节点不包含有关源位置的信息，则该字段为`null`。 否则，它是一个对象，由开始位置（已分析的源区域的第一个字符的位置）和结束位置（已分析的源区域后的第一个字符的位置）组成：

```js
interface SourceLocation {
  source: string | null;
  start: Position;
  end: Position;
}
```

每个`Position`对象都包含一个`line`编号（1-索引）和一个`column`编号（0-索引）：

```js
interface Position {
  line: number; // >= 1
  column: number; // >= 0
}
```

# Identifier

```js
interface Identifier <: Expression, Pattern {
    type: "Identifier";
    name: string;
}
```

标识符。 注意，标识符可以是表达式或解构模式。

# Literal

```js
interface Literal <: Expression {
    type: "Literal";
    value: string | boolean | null | number | RegExp;
}
```

文字令牌。 请注意，文字可以是表达式。

## RegExpLiteral

```js
interface RegExpLiteral <: Literal {
  regex: {
    pattern: string;
    flags: string;
  };
}
```

`regex`属性允许在不支持某些标志（例如`y`或`u`）的环境中表示正则表达式。 在不支持这些标志的环境中，由于正则表达式不能本地表示，因此`value`会为 null。

# Programs

```js
interface Program <: Node {
    type: "Program";
    body: [ Directive | Statement ];
}
```

完整的程序源代码树。

# Functions

```js
interface Function <: Node {
    id: Identifier | null;
    params: [ Pattern ];
    body: FunctionBody;
}
```

函数[declaration](＃functiondeclaration)或[expression](＃functionexpression)。

# Statements

```js
interface Statement <: Node { }
```

任何声明。

## ExpressionStatement

```js
interface ExpressionStatement <: Statement {
    type: "ExpressionStatement";
    expression: Expression;
}
```

表达式语句，即由单个表达式组成的语句。

## Directive

```js
interface Directive <: Node {
    type: "ExpressionStatement";
    expression: Literal;
    directive: string;
}
```

来自脚本或函数的指令序言的指令。
`directive`属性是指令的原始字符串源，不带引号。

## BlockStatement

```js
interface BlockStatement <: Statement {
    type: "BlockStatement";
    body: [ Statement ];
}
```

块语句，即用括号括起来的一系列语句。

## FunctionBody

```js
interface FunctionBody <: BlockStatement {
    body: [ Directive | Statement ];
}
```

函数的主体，是可以以指令开头的块语句。

## EmptyStatement

```js
interface EmptyStatement <: Statement {
    type: "EmptyStatement";
}
```

空语句，即孤立的分号。

## DebuggerStatement

```js
interface DebuggerStatement <: Statement {
    type: "DebuggerStatement";
}
```

`debugger`语句。

## WithStatement

```js
interface WithStatement <: Statement {
    type: "WithStatement";
    object: Expression;
    body: Statement;
}
```

`with`语句。

## Control flow

### ReturnStatement

```js
interface ReturnStatement <: Statement {
    type: "ReturnStatement";
    argument: Expression | null;
}
```

`return`语句。

### LabeledStatement

```js
interface LabeledStatement <: Statement {
    type: "LabeledStatement";
    label: Identifier;
    body: Statement;
}
```

带标签的语句，即以`break` /`continue`标签为前缀的语句。

### BreakStatement

```js
interface BreakStatement <: Statement {
    type: "BreakStatement";
    label: Identifier | null;
}
```

一个`break`语句。

### ContinueStatement

```js
interface ContinueStatement <: Statement {
    type: "ContinueStatement";
    label: Identifier | null;
}
```

`continue`语句。

## Choice

### IfStatement

```js
interface IfStatement <: Statement {
    type: "IfStatement";
    test: Expression;
    consequent: Statement;
    alternate: Statement | null;
}
```

`if`语句。

### SwitchStatement

```js
interface SwitchStatement <: Statement {
    type: "SwitchStatement";
    discriminant: Expression;
    cases: [ SwitchCase ];
}
```

`switch`语句。

#### SwitchCase

```js
interface SwitchCase <: Node {
    type: "SwitchCase";
    test: Expression | null;
    consequent: [ Statement ];
}
```

在`switch`语句主体中的`case`子句（如果`test`是`Expression`）或`default`子句（如果`test === null`）。

## Exceptions

### ThrowStatement

```js
interface ThrowStatement <: Statement {
    type: "ThrowStatement";
    argument: Expression;
}
```

`throw`语句。

### TryStatement

```js
interface TryStatement <: Statement {
    type: "TryStatement";
    block: BlockStatement;
    handler: CatchClause | null;
    finalizer: BlockStatement | null;
}
```

一个`try`语句。 如果`handler`为`null`，则`finalizer`必须为`BlockStatement`。

#### CatchClause

```js
interface CatchClause <: Node {
    type: "CatchClause";
    param: Pattern;
    body: BlockStatement;
}
```

在`try`块之后的`catch`子句。

## Loops

### WhileStatement

```js
interface WhileStatement <: Statement {
    type: "WhileStatement";
    test: Expression;
    body: Statement;
}
```

`while`语句。

### DoWhileStatement

```js
interface DoWhileStatement <: Statement {
    type: "DoWhileStatement";
    body: Statement;
    test: Expression;
}
```

`do` /`while`语句。

### ForStatement

```js
interface ForStatement <: Statement {
    type: "ForStatement";
    init: VariableDeclaration | Expression | null;
    test: Expression | null;
    update: Expression | null;
    body: Statement;
}
```

`for`语句。

### ForInStatement

```js
interface ForInStatement <: Statement {
    type: "ForInStatement";
    left: VariableDeclaration |  Pattern;
    right: Expression;
    body: Statement;
}
```

`for` /`in`语句。

# Declarations

```js
interface Declaration <: Statement { }
```

任何声明节点。 注意声明是声明。 这是因为声明可以出现在任何语句上下文中。

## FunctionDeclaration

```js
interface FunctionDeclaration <: Function, Declaration {
    type: "FunctionDeclaration";
    id: Identifier;
}
```

函数声明。 请注意，与父接口`Function`不同，`id`不能为`null`。

## VariableDeclaration

```js
interface VariableDeclaration <: Declaration {
    type: "VariableDeclaration";
    declarations: [ VariableDeclarator ];
    kind: "var";
}
```

变量声明。

### VariableDeclarator

```js
interface VariableDeclarator <: Node {
    type: "VariableDeclarator";
    id: Pattern;
    init: Expression | null;
}
```

变量声明符。

# Expressions

```js
interface Expression <: Node { }
```

任何表达式节点。 由于赋值的左侧通常可以是任何表达式，因此表达式也可以是模式。

## ThisExpression

```js
interface ThisExpression <: Expression {
    type: "ThisExpression";
}
```

`this`表达式。

## ArrayExpression

```js
interface ArrayExpression <: Expression {
    type: "ArrayExpression";
    elements: [ Expression | null ];
}
```

数组表达式。 如果元素表示稀疏数组中的空位，则该元素可能为`null`。 例如: `[1，，2]`。

## ObjectExpression

```js
interface ObjectExpression <: Expression {
    type: "ObjectExpression";
    properties: [ Property ];
}
```

对象表达式。

### Property

```js
interface Property <: Node {
    type: "Property";
    key: Literal | Identifier;
    value: Expression;
    kind: "init" | "get" | "set";
}
```

对象表达式中的文字属性可以将字符串或数字作为其`value`。 普通的属性初始值设定项的种类为`init`。 getter 和 setter 分别具有种类值`get`和`set`。

## FunctionExpression

```js
interface FunctionExpression <: Function, Expression {
    type: "FunctionExpression";
}
```

函数表达式。

## Unary operations

### UnaryExpression

```js
interface UnaryExpression <: Expression {
    type: "UnaryExpression";
    operator: UnaryOperator;
    prefix: boolean;
    argument: Expression;
}
```

一元运算符表达式。

#### UnaryOperator

```js
enum UnaryOperator {
    "-" | "+" | "!" | "~" | "typeof" | "void" | "delete"
}
```

一元运算符令牌。

### UpdateExpression

```js
interface UpdateExpression <: Expression {
    type: "UpdateExpression";
    operator: UpdateOperator;
    argument: Expression;
    prefix: boolean;
}
```

更新（递增或递减）运算符表达式。

#### UpdateOperator

```js
enum UpdateOperator {
    "++" | "--"
}
```

更新（递增或递减）运算符令牌。

## Binary operations

### BinaryExpression

```js
interface BinaryExpression <: Expression {
    type: "BinaryExpression";
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
}
```

二元运算符表达式。

#### BinaryOperator

```js
enum BinaryOperator {
    "==" | "!=" | "===" | "!=="
         | "<" | "<=" | ">" | ">="
         | "<<" | ">>" | ">>>"
         | "+" | "-" | "*" | "/" | "%"
         | "|" | "^" | "&" | "in"
         | "instanceof"
}
```

二进制运算符。

### AssignmentExpression

```js
interface AssignmentExpression <: Expression {
    type: "AssignmentExpression";
    operator: AssignmentOperator;
    left: Pattern | Expression;
    right: Expression;
}
```

赋值运算符表达式。

#### AssignmentOperator

```js
enum AssignmentOperator {
    "=" | "+=" | "-=" | "*=" | "/=" | "%="
        | "<<=" | ">>=" | ">>>="
        | "|=" | "^=" | "&="
}
```

赋值运算符令牌。

### LogicalExpression

```js
interface LogicalExpression <: Expression {
    type: "LogicalExpression";
    operator: LogicalOperator;
    left: Expression;
    right: Expression;
}
```

逻辑运算符表达式。

#### LogicalOperator

```js
enum LogicalOperator {
    "||" | "&&"
}
```

逻辑运算符。

### MemberExpression

```js
interface MemberExpression <: Expression, Pattern {
    type: "MemberExpression";
    object: Expression;
    property: Expression;
    computed: boolean;
}
```

成员表达式。 如果`computed`为`true`，则该节点对应于已计算的（`a [b]`）成员表达式，而`property`为`Expression`。 如果`computed`为`false`，则该节点对应于静态（`a.b`）成员表达式，而`property`为`Identifier`。

## ConditionalExpression

```js
interface ConditionalExpression <: Expression {
    type: "ConditionalExpression";
    test: Expression;
    alternate: Expression;
    consequent: Expression;
}
```

条件表达式，即三元表达式`?`/`:`。

## CallExpression

```js
interface CallExpression <: Expression {
    type: "CallExpression";
    callee: Expression;
    arguments: [ Expression ];
}
```

函数或方法调用表达式。

## NewExpression

```js
interface NewExpression <: Expression {
    type: "NewExpression";
    callee: Expression;
    arguments: [ Expression ];
}
```

`new`表达式。

## SequenceExpression

```js
interface SequenceExpression <: Expression {
    type: "SequenceExpression";
    expressions: [ Expression ];
}
```

序列表达式，即逗号分隔的表达式序列。

# Patterns

解构绑定和分配不是ES5的一部分，但是所有绑定位置都接受“模式”以允许在ES6中进行解构。 不过，对于ES5，唯一的'Pattern'子类型是[`Identifier`](＃identifier)。

```js
interface Pattern <: Node { }
```
