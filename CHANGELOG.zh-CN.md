---
changelogVersion: 1
plugin: "visduo_ais-seedance-video-t1"
version: "1.1.0"
locale: "zh-CN"
---
# Changelog

## [1.1.0]

### Added

- 使用 `doubao-seedance-2-0-260128`、`doubao-seedance-2-0-fast-260128`、`doubao-seedance-2-0-mini-260615`、`doubao-seedance-2-5-260628` 和 `doubao-seedance-2-5-flash-261115` 模型生成视频，各模型的分辨率和参考视频能力独立配置。
- 支持通过 `POST /api/v3/contents/generations/tasks` 提交任务，并通过 `GET /api/v3/contents/generations/tasks/{task_id}` 查询任务状态。
- 支持 `openai_responses` 协议的流式、同步和后台模式，以及 OpenAI 兼容的 `openai_video` 协议。
- 支持用 `draft_task` 内容项引用已有任务，提交前自动改写为上游任务 ID。
- 上报 `tokens`、`resolution` 和 `video_input` 用量事实，并为参考视频请求提供 `video_input_ratio` 计费系数。
- 将生成的视频和尾帧图片登记为可下载产物。
