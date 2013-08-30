if (typeof exports != "undefined") {
  var test = require("../driver.js").test;
  var testFail = require("../driver.js").testFail;
  var testAssert = require("../driver.js").testAssert;
}

var instructions = [
	{ keyword: '@import', label: 'HyperloopImport' },
	{ keyword: '@class', label: 'HyperloopClass' },
	{ keyword: '@compiler', label: 'HyperloopCompiler' }
];

for (var i = 0; i < instructions.length; i++) {
	var inst = instructions[i];
	var len = inst.keyword.length;

	test(inst.keyword + "()\n", {
		type: "Program",
		body: [
			{
				type: inst.label,
				start: 0,
				end: 2 + len,
				arguments: []
			}
		]
	});

	test(inst.keyword + "(1)\n", {
		type: "Program",
		body: [
			{
				type: inst.label,
				start: 0,
				end: 3 + len,
				arguments: [
					{
						type: 'Literal',
						start: 1 + len,
						end: 2 + len,
						value: 1
					}
				]
			}
		]
	});

	test(inst.keyword + "(1, 'quux')\n", {
		type: "Program",
		body: [
			{
				type: inst.label,
				start: 0,
				end: 11 + len,
				arguments: [
					{
						type: 'Literal',
						start: 1 + len,
						end: 2 + len,
						value: 1
					},
					{
						type: 'Literal',
						start: 4 + len,
						end: 10 + len,
						value: 'quux'
					}
				]
			}
		]
	});

	test(inst.keyword + "(function(){})\n", {
		type: "Program",
		body: [
			{
				type: inst.label,
				start: 0,
				end: 14 + len,
				arguments: [
					{
						type: 'FunctionExpression',
						start: 1 + len,
						end: 13 + len,
						id: null,
            params: [],
            body: {
              type: "BlockStatement",
              body: []
            }
					}
				]
			}
		]
	});

	test(inst.keyword + "(function foo(){})\n", {
		type: "Program",
		body: [
			{
				type: inst.label,
				start: 0,
				end: 18 + len,
				arguments: [
					{
						type: 'FunctionExpression',
						start: 1 + len,
						end: 17 + len,
						id: {
							type: "Identifier",
							start: 10 + len,
							end: 13 + len,
							loc: {
								start: {
									line: 1,
									column: 10 + len
								},
								end: {
									line: 1,
									column: 13 + len
								}
							},
							name: "foo"
						},
            params: [],
            body: {
              type: "BlockStatement",
              body: []
            }
					}
				]
			}
		]
	});

	testFail(inst.keyword, "Unexpected token (1:" + len + ")");
	testFail(inst.keyword + "(", "Unexpected token (1:" + (1+len) + ")");
	testFail(inst.keyword + ".foo", "Unexpected token (1:" + len + ")");
	testFail(inst.keyword + "['foo']", "Unexpected token (1:" + (7+len) + ")");
}

testFail("@foo", "'@foo' is an invalid a hyperloop instruction (1:0)");
