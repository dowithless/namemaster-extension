# Change Log

All notable changes to the "namemaster" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.8]

- 动态获取当前文件类型, 以便 ai 更好的提供命名建议(不再 hardcode js)
- 根据服务返回的 kind 设置补全项类型, 不再是固定的 Text 类型
  - 这里目前还不完善, 还可以继续优化
