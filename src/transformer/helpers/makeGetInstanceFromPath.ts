import ts, { factory } from "typescript";

export function makeGetInstanceFromPath(
	root: ts.Identifier | ts.PropertyAccessExpression,
	stringRoot: string,
) {
	return factory.createFunctionDeclaration(
		undefined,
		undefined,
		undefined,
		factory.createIdentifier("___getInstanceFromPath"),
		[
			factory.createTypeParameterDeclaration(
				factory.createIdentifier("T"),
				undefined,
				undefined,
			),
		],
		[
			factory.createParameterDeclaration(
				undefined,
				undefined,
				undefined,
				factory.createIdentifier("entries"),
				undefined,
				factory.createArrayTypeNode(
					factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
				),
				undefined,
			),
			factory.createParameterDeclaration(
				undefined,
				undefined,
				undefined,
				factory.createIdentifier("waitFor"),
				undefined,
				undefined,
				factory.createFalse(),
			),
			factory.createParameterDeclaration(
				undefined,
				undefined,
				undefined,
				factory.createIdentifier("timeout"),
				factory.createToken(ts.SyntaxKind.QuestionToken),
				factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
				undefined,
			),
		],
		undefined,
		factory.createBlock(
			[
				factory.createVariableStatement(
					undefined,
					factory.createVariableDeclarationList(
						[
							factory.createVariableDeclaration(
								factory.createIdentifier("currentIndex"),
								undefined,
								undefined,
								factory.createNumericLiteral("0"),
							),
						],
						ts.NodeFlags.Let,
					),
				),
				factory.createVariableStatement(
					undefined,
					factory.createVariableDeclarationList(
						[
							factory.createVariableDeclaration(
								factory.createIdentifier("lastParent"),
								undefined,
								factory.createTypeReferenceNode(
									factory.createIdentifier("Instance"),
									undefined,
								),
								ts.clone(root),
							),
						],
						ts.NodeFlags.Let,
					),
				),
				factory.createVariableStatement(
					undefined,
					factory.createVariableDeclarationList(
						[
							factory.createVariableDeclaration(
								factory.createIdentifier("currentObject"),
								undefined,
								factory.createUnionTypeNode([
									factory.createTypeReferenceNode(
										factory.createIdentifier("Instance"),
										undefined,
									),
									factory.createKeywordTypeNode(
										ts.SyntaxKind.UndefinedKeyword,
									),
								]),
								ts.clone(root),
							),
						],
						ts.NodeFlags.Let,
					),
				),
				factory.createVariableStatement(
					undefined,
					factory.createVariableDeclarationList(
						[
							factory.createVariableDeclaration(
								factory.createIdentifier("modified"),
								undefined,
								undefined,
								factory.createTrue(),
							),
						],
						ts.NodeFlags.Let,
					),
				),
				factory.createSwitchStatement(
					factory.createElementAccessExpression(
						factory.createIdentifier("entries"),
						factory.createNumericLiteral("0"),
					),
					factory.createCaseBlock([
						factory.createCaseClause(
							factory.createStringLiteral("StarterPlayer"),
							[
								factory.createExpressionStatement(
									factory.createBinaryExpression(
										factory.createIdentifier(
											"currentObject",
										),
										factory.createToken(
											ts.SyntaxKind.EqualsToken,
										),
										factory.createPropertyAccessExpression(
											factory.createCallExpression(
												factory.createPropertyAccessExpression(
													factory.createIdentifier(
														"game",
													),
													factory.createIdentifier(
														"GetService",
													),
												),
												undefined,
												[
													factory.createStringLiteral(
														"Players",
													),
												],
											),
											factory.createIdentifier(
												"LocalPlayer",
											),
										),
									),
								),
								factory.createExpressionStatement(
									factory.createBinaryExpression(
										factory.createIdentifier("lastParent"),
										factory.createToken(
											ts.SyntaxKind.EqualsToken,
										),
										factory.createIdentifier(
											"currentObject",
										),
									),
								),
								factory.createSwitchStatement(
									factory.createElementAccessExpression(
										factory.createIdentifier("entries"),
										factory.createNumericLiteral("1"),
									),
									factory.createCaseBlock([
										factory.createCaseClause(
											factory.createStringLiteral(
												"StarterCharacterScripts",
											),
											[
												factory.createVariableStatement(
													undefined,
													factory.createVariableDeclarationList(
														[
															factory.createVariableDeclaration(
																factory.createIdentifier(
																	"character",
																),
																undefined,
																undefined,
																factory.createPropertyAccessExpression(
																	factory.createParenthesizedExpression(
																		factory.createAsExpression(
																			factory.createIdentifier(
																				"currentObject",
																			),
																			factory.createTypeReferenceNode(
																				factory.createIdentifier(
																					"Player",
																				),
																				undefined,
																			),
																		),
																	),
																	factory.createIdentifier(
																		"Character",
																	),
																),
															),
														],
														ts.NodeFlags.Const,
													),
												),
												factory.createIfStatement(
													factory.createPrefixUnaryExpression(
														ts.SyntaxKind
															.ExclamationToken,
														factory.createIdentifier(
															"character",
														),
													),
													factory.createBlock(
														[
															factory.createExpressionStatement(
																factory.createCallExpression(
																	factory.createIdentifier(
																		"error",
																	),
																	undefined,
																	[
																		factory.createStringLiteral(
																			"The character isn't loaded but referenced from StarterCharacterScripts",
																		),
																		factory.createNumericLiteral(
																			"2",
																		),
																	],
																),
															),
														],
														true,
													),
													undefined,
												),
												factory.createExpressionStatement(
													factory.createBinaryExpression(
														factory.createIdentifier(
															"currentObject",
														),
														factory.createToken(
															ts.SyntaxKind
																.EqualsToken,
														),
														factory.createIdentifier(
															"character",
														),
													),
												),
												factory.createExpressionStatement(
													factory.createBinaryExpression(
														factory.createIdentifier(
															"lastParent",
														),
														factory.createToken(
															ts.SyntaxKind
																.EqualsToken,
														),
														factory.createIdentifier(
															"character",
														),
													),
												),
												factory.createBreakStatement(
													undefined,
												),
											],
										),
										factory.createCaseClause(
											factory.createStringLiteral(
												"StarterPlayerScripts",
											),
											[
												factory.createVariableStatement(
													undefined,
													factory.createVariableDeclarationList(
														[
															factory.createVariableDeclaration(
																factory.createIdentifier(
																	"scripts",
																),
																undefined,
																undefined,
																factory.createPropertyAccessExpression(
																	factory.createParenthesizedExpression(
																		factory.createAsExpression(
																			factory.createIdentifier(
																				"currentObject",
																			),
																			factory.createIntersectionTypeNode(
																				[
																					factory.createTypeReferenceNode(
																						factory.createIdentifier(
																							"Player",
																						),
																						undefined,
																					),
																					factory.createTypeLiteralNode(
																						[
																							factory.createPropertySignature(
																								undefined,
																								factory.createIdentifier(
																									"PlayerScripts",
																								),
																								undefined,
																								factory.createTypeReferenceNode(
																									factory.createIdentifier(
																										"PlayerScripts",
																									),
																									undefined,
																								),
																							),
																						],
																					),
																				],
																			),
																		),
																	),
																	factory.createIdentifier(
																		"PlayerScripts",
																	),
																),
															),
														],
														ts.NodeFlags.Const,
													),
												),
												factory.createExpressionStatement(
													factory.createBinaryExpression(
														factory.createIdentifier(
															"currentObject",
														),
														factory.createToken(
															ts.SyntaxKind
																.EqualsToken,
														),
														factory.createIdentifier(
															"scripts",
														),
													),
												),
												factory.createExpressionStatement(
													factory.createBinaryExpression(
														factory.createIdentifier(
															"lastParent",
														),
														factory.createToken(
															ts.SyntaxKind
																.EqualsToken,
														),
														factory.createIdentifier(
															"scripts",
														),
													),
												),
												factory.createBreakStatement(
													undefined,
												),
											],
										),
										factory.createDefaultClause([
											factory.createExpressionStatement(
												factory.createCallExpression(
													factory.createIdentifier(
														"error",
													),
													undefined,
													[
														factory.createTemplateExpression(
															factory.createTemplateHead(
																"",
																"",
															),
															[
																factory.createTemplateSpan(
																	factory.createElementAccessExpression(
																		factory.createIdentifier(
																			"entries",
																		),
																		factory.createNumericLiteral(
																			"1",
																		),
																	),
																	factory.createTemplateTail(
																		" is not a member of StarterPlayer!",
																		" is not a member of StarterPlayer!",
																	),
																),
															],
														),
													],
												),
											),
										]),
									]),
								),
								factory.createBreakStatement(undefined),
							],
						),
						factory.createCaseClause(
							factory.createStringLiteral("StarterGui"),
							[
								factory.createVariableStatement(
									undefined,
									factory.createVariableDeclarationList(
										[
											factory.createVariableDeclaration(
												factory.createIdentifier("gui"),
												undefined,
												undefined,
												factory.createCallExpression(
													factory.createPropertyAccessExpression(
														factory.createParenthesizedExpression(
															factory.createAsExpression(
																factory.createIdentifier(
																	"currentObject",
																),
																factory.createTypeReferenceNode(
																	factory.createIdentifier(
																		"Player",
																	),
																	undefined,
																),
															),
														),
														factory.createIdentifier(
															"FindFirstChild",
														),
													),
													undefined,
													[
														factory.createStringLiteral(
															"PlayerGui",
														),
													],
												),
											),
										],
										ts.NodeFlags.Const,
									),
								),
								factory.createIfStatement(
									factory.createPrefixUnaryExpression(
										ts.SyntaxKind.ExclamationToken,
										factory.createIdentifier("gui"),
									),
									factory.createBlock(
										[
											factory.createExpressionStatement(
												factory.createCallExpression(
													factory.createIdentifier(
														"error",
													),
													undefined,
													[
														factory.createStringLiteral(
															"PlayerGui isn't loaded but referenced from PlayerGui",
														),
													],
												),
											),
										],
										true,
									),
									undefined,
								),
								factory.createExpressionStatement(
									factory.createBinaryExpression(
										factory.createIdentifier(
											"currentObject",
										),
										factory.createToken(
											ts.SyntaxKind.EqualsToken,
										),
										factory.createIdentifier("gui"),
									),
								),
								factory.createExpressionStatement(
									factory.createBinaryExpression(
										factory.createIdentifier("lastParent"),
										factory.createToken(
											ts.SyntaxKind.EqualsToken,
										),
										factory.createIdentifier(
											"currentObject",
										),
									),
								),
								factory.createBreakStatement(undefined),
							],
						),
						factory.createCaseClause(
							factory.createStringLiteral("StarterPack"),
							[
								factory.createVariableStatement(
									undefined,
									factory.createVariableDeclarationList(
										[
											factory.createVariableDeclaration(
												factory.createIdentifier(
													"backpack",
												),
												undefined,
												undefined,
												factory.createPropertyAccessExpression(
													factory.createParenthesizedExpression(
														factory.createAsExpression(
															factory.createIdentifier(
																"currentObject",
															),
															factory.createIntersectionTypeNode(
																[
																	factory.createTypeReferenceNode(
																		factory.createIdentifier(
																			"Player",
																		),
																		undefined,
																	),
																	factory.createTypeLiteralNode(
																		[
																			factory.createPropertySignature(
																				undefined,
																				factory.createIdentifier(
																					"Backpack",
																				),
																				undefined,
																				factory.createTypeReferenceNode(
																					factory.createIdentifier(
																						"Backpack",
																					),
																					undefined,
																				),
																			),
																		],
																	),
																],
															),
														),
													),
													factory.createIdentifier(
														"Backpack",
													),
												),
											),
										],
										ts.NodeFlags.Const,
									),
								),
								factory.createExpressionStatement(
									factory.createBinaryExpression(
										factory.createIdentifier(
											"currentObject",
										),
										factory.createToken(
											ts.SyntaxKind.EqualsToken,
										),
										factory.createIdentifier("backpack"),
									),
								),
								factory.createExpressionStatement(
									factory.createBinaryExpression(
										factory.createIdentifier("lastParent"),
										factory.createToken(
											ts.SyntaxKind.EqualsToken,
										),
										factory.createIdentifier(
											"currentObject",
										),
									),
								),
								factory.createBreakStatement(undefined),
							],
						),
						factory.createDefaultClause([
							factory.createExpressionStatement(
								factory.createBinaryExpression(
									factory.createIdentifier("modified"),
									factory.createToken(
										ts.SyntaxKind.EqualsToken,
									),
									factory.createFalse(),
								),
							),
							factory.createBreakStatement(undefined),
						]),
					]),
				),
				factory.createIfStatement(
					factory.createIdentifier("modified"),
					factory.createBlock(
						[
							factory.createExpressionStatement(
								factory.createCallExpression(
									factory.createPropertyAccessExpression(
										factory.createIdentifier("entries"),
										factory.createIdentifier("remove"),
									),
									undefined,
									[factory.createNumericLiteral("0")],
								),
							),
							factory.createExpressionStatement(
								factory.createCallExpression(
									factory.createPropertyAccessExpression(
										factory.createIdentifier("entries"),
										factory.createIdentifier("remove"),
									),
									undefined,
									[factory.createNumericLiteral("0")],
								),
							),
						],
						true,
					),
					undefined,
				),
				factory.createWhileStatement(
					factory.createBinaryExpression(
						factory.createBinaryExpression(
							factory.createIdentifier("currentIndex"),
							factory.createToken(ts.SyntaxKind.LessThanToken),
							factory.createCallExpression(
								factory.createPropertyAccessExpression(
									factory.createIdentifier("entries"),
									factory.createIdentifier("size"),
								),
								undefined,
								[],
							),
						),
						factory.createToken(
							ts.SyntaxKind.AmpersandAmpersandToken,
						),
						factory.createBinaryExpression(
							factory.createIdentifier("currentObject"),
							factory.createToken(
								ts.SyntaxKind.ExclamationEqualsEqualsToken,
							),
							factory.createIdentifier("undefined"),
						),
					),
					factory.createBlock(
						[
							factory.createExpressionStatement(
								factory.createBinaryExpression(
									factory.createIdentifier("lastParent"),
									factory.createToken(
										ts.SyntaxKind.EqualsToken,
									),
									factory.createIdentifier("currentObject"),
								),
							),
							factory.createExpressionStatement(
								factory.createBinaryExpression(
									factory.createIdentifier("currentObject"),
									factory.createToken(
										ts.SyntaxKind.EqualsToken,
									),
									factory.createConditionalExpression(
										factory.createIdentifier("waitFor"),
										factory.createToken(
											ts.SyntaxKind.QuestionToken,
										),
										factory.createCallExpression(
											factory.createPropertyAccessExpression(
												factory.createIdentifier(
													"currentObject",
												),
												factory.createIdentifier(
													"WaitForChild",
												),
											),
											undefined,
											[
												factory.createElementAccessExpression(
													factory.createIdentifier(
														"entries",
													),
													factory.createIdentifier(
														"currentIndex",
													),
												),
												factory.createAsExpression(
													factory.createIdentifier(
														"timeout",
													),
													factory.createKeywordTypeNode(
														ts.SyntaxKind
															.NumberKeyword,
													),
												),
											],
										),
										factory.createToken(
											ts.SyntaxKind.ColonToken,
										),
										factory.createCallExpression(
											factory.createPropertyAccessExpression(
												factory.createIdentifier(
													"currentObject",
												),
												factory.createIdentifier(
													"FindFirstChild",
												),
											),
											undefined,
											[
												factory.createElementAccessExpression(
													factory.createIdentifier(
														"entries",
													),
													factory.createIdentifier(
														"currentIndex",
													),
												),
											],
										),
									),
								),
							),
							factory.createExpressionStatement(
								factory.createPostfixUnaryExpression(
									factory.createIdentifier("currentIndex"),
									ts.SyntaxKind.PlusPlusToken,
								),
							),
						],
						true,
					),
				),
				factory.createIfStatement(
					factory.createBinaryExpression(
						factory.createIdentifier("currentObject"),
						factory.createToken(
							ts.SyntaxKind.EqualsEqualsEqualsToken,
						),
						factory.createIdentifier("undefined"),
					),
					factory.createBlock(
						[
							factory.createExpressionStatement(
								factory.createCallExpression(
									factory.createPropertyAccessExpression(
										factory.createIdentifier("entries"),
										factory.createIdentifier("unshift"),
									),
									undefined,
									[factory.createStringLiteral(stringRoot)],
								),
							),
							factory.createExpressionStatement(
								factory.createCallExpression(
									factory.createIdentifier("error"),
									undefined,
									[
										factory.createTemplateExpression(
											factory.createTemplateHead(
												"Cannot find ",
												"Cannot find ",
											),
											[
												factory.createTemplateSpan(
													factory.createCallExpression(
														factory.createPropertyAccessExpression(
															factory.createIdentifier(
																"entries",
															),
															factory.createIdentifier(
																"join",
															),
														),
														undefined,
														[
															factory.createStringLiteral(
																".",
															),
														],
													),
													factory.createTemplateMiddle(
														" because ",
														" because ",
													),
												),
												factory.createTemplateSpan(
													factory.createElementAccessExpression(
														factory.createIdentifier(
															"entries",
														),
														factory.createIdentifier(
															"currentIndex",
														),
													),
													factory.createTemplateMiddle(
														" is not a child of ",
														" is not a child of ",
													),
												),
												factory.createTemplateSpan(
													factory.createCallExpression(
														factory.createPropertyAccessExpression(
															factory.createIdentifier(
																"lastParent",
															),
															factory.createIdentifier(
																"GetFullName",
															),
														),
														undefined,
														[],
													),
													factory.createTemplateTail(
														"",
														"",
													),
												),
											],
										),
										factory.createNumericLiteral("2"),
									],
								),
							),
						],
						true,
					),
					undefined,
				),
				factory.createReturnStatement(
					factory.createAsExpression(
						factory.createAsExpression(
							factory.createIdentifier("currentObject"),
							factory.createKeywordTypeNode(
								ts.SyntaxKind.UnknownKeyword,
							),
						),
						factory.createTypeReferenceNode(
							factory.createIdentifier("T"),
							undefined,
						),
					),
				),
			],
			true,
		),
	);
}
