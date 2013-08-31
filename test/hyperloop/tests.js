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

	test(inst.keyword + "({ cflags: ['-DDEBUG=1'] })\n", {
		type: "Program",
		body: [
			{
				type: inst.label,
				start: 0,
				end: 27 + len,
				arguments: [
					{
						type: 'ObjectExpression',
						start: 1 + len,
						end: 26 + len,
						properties: [
							{
								key: {
									type: 'Identifier',
									start: 3 + len,
									end: 9 + len,
									name: 'cflags'
								},
								value: {
									type: 'ArrayExpression',
									start: 11 + len,
									end: 24 + len,
									elements: [
										{
											type: 'Literal',
											start: 12 + len,
											end: 23 + len,
											value: "-DDEBUG=1",
											raw: "'-DDEBUG=1'"
										}
									]
								}
							}
						]
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

test("var callback = @class(function(sender) {})\n", {
	type: "Program",
	start: 0,
	end: 42,
	body: [
		{
			type: "VariableDeclaration",
			start: 0,
			end: 42,
			declarations: [
				{
					type: "VariableDeclarator",
					start: 4,
					end: 42,
					id: {
						type: "Identifier",
						start: 4,
						end: 12,
						name: "callback"
					},
					init: {
						type: "HyperloopClass",
						start: 15,
						end: 42,
						arguments: [
							{
								type: "FunctionExpression",
								start: 22,
								end: 41,
								id: null,
								params: [
									{
										type: "Identifier",
										start: 31,
										end: 37,
										name: "sender"
									}
								],
								body: {
									type: "BlockStatement",
									start: 39,
									end: 41,
									body: []
								}
							}
						]
					}
				}
			],
			kind: "var"
		}
	]
});

test("var callback = @class('Classname', function(sender) {})\n", {
  "type": "Program",
  "start": 0,
  "end": 55,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 55,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 55,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 12,
            "name": "callback"
          },
          "init": {
            "type": "HyperloopClass",
            "start": 15,
            "end": 55,
            "arguments": [
              {
                "type": "Literal",
                "start": 22,
                "end": 33,
                "value": "Classname",
                "raw": "'Classname'"
              },
              {
                "type": "FunctionExpression",
                "start": 35,
                "end": 54,
                "id": null,
                "params": [
                  {
                    "type": "Identifier",
                    "start": 44,
                    "end": 50,
                    "name": "sender"
                  }
                ],
                "body": {
                  "type": "BlockStatement",
                  "start": 52,
                  "end": 54,
                  "body": []
                }
              }
            ]
          }
        }
      ],
      "kind": "var"
    }
  ]
});

test("var callback = @class('Classname', [], function(sender) {})\n", {
  "type": "Program",
  "start": 0,
  "end": 59,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 59,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 59,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 12,
            "name": "callback"
          },
          "init": {
            "type": "HyperloopClass",
            "start": 15,
            "end": 59,
            "arguments": [
              {
                "type": "Literal",
                "start": 22,
                "end": 33,
                "value": "Classname",
                "raw": "'Classname'"
              },
              {
                "type": "ArrayExpression",
                "start": 35,
                "end": 37,
                "elements": []
              },
              {
                "type": "FunctionExpression",
                "start": 39,
                "end": 58,
                "id": null,
                "params": [
                  {
                    "type": "Identifier",
                    "start": 48,
                    "end": 54,
                    "name": "sender"
                  }
                ],
                "body": {
                  "type": "BlockStatement",
                  "start": 56,
                  "end": 58,
                  "body": []
                }
              }
            ]
          }
        }
      ],
      "kind": "var"
    }
  ]
});

test("var callback = @class('Classname', ['interface1', 'interface2'], function(sender) {})\n", {
  "type": "Program",
  "start": 0,
  "end": 85,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 85,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 85,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 12,
            "name": "callback"
          },
          "init": {
            "type": "HyperloopClass",
            "start": 15,
            "end": 85,
            "arguments": [
              {
                "type": "Literal",
                "start": 22,
                "end": 33,
                "value": "Classname",
                "raw": "'Classname'"
              },
              {
                "type": "ArrayExpression",
                "start": 35,
                "end": 63,
                "elements": [
                  {
                    "type": "Literal",
                    "start": 36,
                    "end": 48,
                    "value": "interface1",
                    "raw": "'interface1'"
                  },
                  {
                    "type": "Literal",
                    "start": 50,
                    "end": 62,
                    "value": "interface2",
                    "raw": "'interface2'"
                  }
                ]
              },
              {
                "type": "FunctionExpression",
                "start": 65,
                "end": 84,
                "id": null,
                "params": [
                  {
                    "type": "Identifier",
                    "start": 74,
                    "end": 80,
                    "name": "sender"
                  }
                ],
                "body": {
                  "type": "BlockStatement",
                  "start": 82,
                  "end": 84,
                  "body": []
                }
              }
            ]
          }
        }
      ],
      "kind": "var"
    }
  ]
});

test("var callback = @class(function foo(sender) { NSLog('clicked on button=%@', sender); })", {
  "type": "Program",
  "start": 0,
  "end": 86,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 86,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 86,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 12,
            "name": "callback"
          },
          "init": {
            "type": "HyperloopClass",
            "start": 15,
            "end": 86,
            "arguments": [
              {
                "type": "FunctionExpression",
                "start": 22,
                "end": 85,
                "id": {
                  "type": "Identifier",
                  "start": 31,
                  "end": 34,
                  "name": "foo"
                },
                "params": [
                  {
                    "type": "Identifier",
                    "start": 35,
                    "end": 41,
                    "name": "sender"
                  }
                ],
                "body": {
                  "type": "BlockStatement",
                  "start": 43,
                  "end": 85,
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "start": 45,
                      "end": 83,
                      "expression": {
                        "type": "CallExpression",
                        "start": 45,
                        "end": 82,
                        "callee": {
                          "type": "Identifier",
                          "start": 45,
                          "end": 50,
                          "name": "NSLog"
                        },
                        "arguments": [
                          {
                            "type": "Literal",
                            "start": 51,
                            "end": 73,
                            "value": "clicked on button=%@",
                            "raw": "'clicked on button=%@'"
                          },
                          {
                            "type": "Identifier",
                            "start": 75,
                            "end": 81,
                            "name": "sender"
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ],
      "kind": "var"
    }
  ]
});

test("@import('UIKit/UIApplication');\n" +
"@import('Foundation/NSLog');\n" +
"\n" +
"@compiler({\n" +
"	cflags: ['-DDEBUG=1']\n" +
"});\n" +
"\n" +
"var callback = @class(function foo(sender) {\n" +
"	NSLog('clicked on button=%@', sender);\n" +
"});", {
  "type": "Program",
  "start": 0,
  "end": 190,
  "body": [
    {
      "type": "HyperloopImport",
      "start": 0,
      "end": 31,
      "arguments": [
        {
          "type": "Literal",
          "start": 8,
          "end": 29,
          "value": "UIKit/UIApplication",
          "raw": "'UIKit/UIApplication'"
        }
      ]
    },
    {
      "type": "HyperloopImport",
      "start": 32,
      "end": 60,
      "arguments": [
        {
          "type": "Literal",
          "start": 40,
          "end": 58,
          "value": "Foundation/NSLog",
          "raw": "'Foundation/NSLog'"
        }
      ]
    },
    {
      "type": "HyperloopCompiler",
      "start": 62,
      "end": 100,
      "arguments": [
        {
          "type": "ObjectExpression",
          "start": 72,
          "end": 98,
          "properties": [
            {
              "key": {
                "type": "Identifier",
                "start": 75,
                "end": 81,
                "name": "cflags"
              },
              "value": {
                "type": "ArrayExpression",
                "start": 83,
                "end": 96,
                "elements": [
                  {
                    "type": "Literal",
                    "start": 84,
                    "end": 95,
                    "value": "-DDEBUG=1",
                    "raw": "'-DDEBUG=1'"
                  }
                ]
              },
              "kind": "init"
            }
          ]
        }
      ]
    },
    {
      "type": "VariableDeclaration",
      "start": 102,
      "end": 189,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 106,
          "end": 189,
          "id": {
            "type": "Identifier",
            "start": 106,
            "end": 114,
            "name": "callback"
          },
          "init": {
            "type": "HyperloopClass",
            "start": 117,
            "end": 189,
            "arguments": [
              {
                "type": "FunctionExpression",
                "start": 124,
                "end": 188,
                "id": {
                  "type": "Identifier",
                  "start": 133,
                  "end": 136,
                  "name": "foo"
                },
                "params": [
                  {
                    "type": "Identifier",
                    "start": 137,
                    "end": 143,
                    "name": "sender"
                  }
                ],
                "body": {
                  "type": "BlockStatement",
                  "start": 145,
                  "end": 188,
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "start": 148,
                      "end": 186,
                      "expression": {
                        "type": "CallExpression",
                        "start": 148,
                        "end": 185,
                        "callee": {
                          "type": "Identifier",
                          "start": 148,
                          "end": 153,
                          "name": "NSLog"
                        },
                        "arguments": [
                          {
                            "type": "Literal",
                            "start": 154,
                            "end": 176,
                            "value": "clicked on button=%@",
                            "raw": "'clicked on button=%@'"
                          },
                          {
                            "type": "Identifier",
                            "start": 178,
                            "end": 184,
                            "name": "sender"
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ],
      "kind": "var"
    }
  ]
});

testFail("@foo", "'@foo' is an invalid a hyperloop instruction (1:0)");
