---
locale: zh-CN
---
# EchoStack Seedance 视频生成 T1

通过 New API 创建 Seedance 异步视频生成任务。

## 渠道设置

渠道类型选任务插件（61），绑定 `EchoStack Seedance Video Generations T1`。Base URL 和密钥从 EchoStack 网关控制台中获取。插件不内置默认地址，渠道 Base URL 为必填项。

如果上游是另一台 New API 网关，渠道类型选 New API（60），填写该网关的地址和令牌。插件直接使用渠道 Base URL，不再追加前缀；上游网关也需要安装本插件。

## 模型

| 模型 | 分辨率 | 未指定时长时用于计费的时长 | 参考视频 |
| --- | --- | --- | --- |
| `doubao-seedance-2-0-260128` | 480p、720p、1080p、4k | 15 秒 | 支持 |
| `doubao-seedance-2-0-fast-260128` | 480p、720p | 15 秒 | 支持 |
| `doubao-seedance-2-0-mini-260615` | 480p、720p | 15 秒 | 支持 |
| `doubao-seedance-2-5-260628` | 480p、720p、1080p | 30 秒 | 支持 |
| `doubao-seedance-2-5-flash-261115` | 480p、720p | 30 秒 | 支持 |
| `ais-seedance-video-test` | 480p、720p、1080p、4k | 30 秒 | 支持 |

请求未指定时长时，插件按表中的时长计费。`seconds` 传 `-1` 表示由上游自动决定时长。

## 接口

| 接口 | 用途 |
| --- | --- |
| `POST /api/v3/contents/generations/tasks` | 提交任务 |
| `GET /api/v3/contents/generations/tasks/{task_id}` | 查询任务状态 |

插件同时声明 `openai_responses` 协议（支持流式、同步和后台模式）以及 OpenAI 兼容的 `openai_video` 协议，OpenAI 风格的客户端可以调用同一批模型。

## 计费

计费数量字段为 `tokens`。上游在任务完成时返回用量时以该用量为准；否则插件按所选分辨率以 `时长 × 宽 × 高 × 24 / 1024` 估算，例如 5 秒 720p 视频为 108,000 tokens。

请求携带参考视频时，插件会把模型的最长时长加到估算秒数上，输入视频同样计入 `tokens`。以 2.5 系列模型为例，5 秒输出加 30 秒输入，720p 为 756,000 tokens。

请求未指定分辨率时，支持 1080p 的模型按 1080p 计费，其余模型按支持的最高分辨率计费。

`resolution` 和 `video_input` 随 `tokens` 一起上报，可用于价格表达式。插件自身不施加任何倍率，参考视频请求只通过更大的 `tokens` 值计费。

请为每个模型支持的每种分辨率与参考视频组合设置价格。

## 示例

    curl https://gateway.example.com/api/v3/contents/generations/tasks \
      -H "Authorization: Bearer sk-..." \
      -H "Content-Type: application/json" \
      -d '{"model": "doubao-seedance-2-5-260628", "content": [{"type": "text", "text": "清晨窗台上的一只猫"}]}'

再用返回的任务 ID 轮询状态：

    curl https://gateway.example.com/api/v3/contents/generations/tasks/TASK_ID \
      -H "Authorization: Bearer sk-..."

## 参考素材

参考素材以 `image_url` 或 `video_url` 内容项的形式与 `text` 项一起放入 `content`。需要复用已有任务时，加入一个 `draft_task` 内容项，插件会在提交前把其中的 ID 替换为上游任务 ID。

    {"type": "draft_task", "draft_task": {"id": "TASK_ID"}}

## 限制

- `model` 必填；`content` 必须是数组，且至少包含一个对象项。
- 原生任务接口不支持 `callback_url`，请改为轮询任务。
- `resolution` 必须是该模型支持的分辨率之一；`size` 传 `宽 x 高` 时会映射到对应分辨率。
- `seconds` 支持 `-1`（自动时长）或正数。OpenAI 兼容的视频协议最多允许 3600。
- 参考素材必须是 URL，不接受 multipart 文件上传。
- `draft_task` 引用仅在网关仍能解析该已有任务时可用。
