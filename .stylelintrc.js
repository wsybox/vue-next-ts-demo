module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-rational-order', 'stylelint-config-prettier'],
  plugins: ['stylelint-order', 'stylelint-declaration-block-no-ignored-properties'],
  rules: {
    'plugin/declaration-block-no-ignored-properties': true,
    'declaration-empty-line-before': 'never', // 样式代码换行
    'no-descending-specificity': null,
    'selector-list-comma-space-before': 'never', // 组选择器逗号之前不允许空格
    'selector-list-comma-newline-after': 'always', // 组选择器逗号之后必须有一个空格
    'declaration-colon-space-after': 'always', // 声明的冒号之前不允许空格
    'declaration-colon-space-before': 'never', // 声明的冒号之后必须有一个空格
    'media-feature-colon-space-after': 'always', // @media方法里的冒号之前不允许空格
    'media-feature-colon-space-before': 'never', // @media方法里的冒号之后必须有一个空格
    'value-list-comma-newline-after': 'always-multi-line', // 样式值之间逗号换行时必须在每一行的最后
    'value-list-comma-space-after': 'always-single-line', // 样式值之间逗号后换行时不允许有空格,不换行必须有一个空格
    'value-list-comma-space-before': 'never', //样式值之间逗号前不允许空格
    'rule-empty-line-before': ['always', { except: ['first-nested'] }], // 嵌套规则除第一个之外换行
    'string-quotes': 'single', // 只能使用单引号
    'at-rule-no-unknown': [true, { ignoreAtRules: ['mixin', 'extend', 'content', 'if', 'else'] }], // 屏蔽一些scss等语法检查
    'block-no-empty': true, // 不允许 {} 内为空
    'function-name-case': 'lower', // 函数名称只能小写
  },
  ignoreFiles: ['node_modules/**/*', 'build/**/*', 'dist/**/*'],
}
