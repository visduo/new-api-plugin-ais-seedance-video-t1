---
translations:
  zh-CN: README.zh-CN.md
---
# EchoStack Seedance Video Generations T1

Creates asynchronous Seedance video generation tasks through New API.

## Channel setup

Choose the Task Plugin (61) channel type and bind `EchoStack Seedance Video Generations T1`. Enter the Base URL and key from the EchoStack gateway console. The plugin ships no default address, so the channel Base URL is required.

If the upstream is another New API gateway, choose the New API (60) channel type and enter that gateway's address and token. The plugin calls the channel Base URL unchanged, so the upstream gateway also needs this plugin installed.

## Models

| Model | Resolutions | Duration used when omitted | Reference video |
| --- | --- | --- | --- |
| `doubao-seedance-2-0-260128` | 480p, 720p, 1080p, 4k | 15 s | yes |
| `doubao-seedance-2-0-fast-260128` | 480p, 720p | 15 s | yes |
| `doubao-seedance-2-0-mini-260615` | 480p, 720p | 15 s | yes |
| `doubao-seedance-2-5-260628` | 480p, 720p, 1080p | 30 s | yes |
| `doubao-seedance-2-5-flash-261115` | 480p, 720p | 30 s | yes |
| `ais-seedance-video-test` | 480p, 720p, 1080p, 4k | 30 s | yes |

When a request omits the duration, the plugin bills the duration shown in the table. Send `-1` as `seconds` to ask the upstream for an automatic duration.

## Endpoints

| Endpoint | Purpose |
| --- | --- |
| `POST /api/v3/contents/generations/tasks` | Submit a task |
| `GET /api/v3/contents/generations/tasks/{task_id}` | Read the task status |

The plugin also declares the `openai_responses` protocol with streaming, synchronous and background modes, and the OpenAI-compatible `openai_video` protocol, so OpenAI-style clients can reach the same models.

## Billing

`tokens` is the billable quantity. Unless the upstream reports its own usage when the task completes, the plugin estimates it as `seconds × width × height × 24 / 1024` at the chosen resolution, for example 108,000 tokens for a 5-second 720p video.

When the request carries a reference video, the plugin adds the model's longest duration to the estimated seconds, so the input video is billed in the same `tokens` quantity. For a 2.5 model that is 5 s of output plus 30 s of input, or 756,000 tokens at 720p.

When a request omits the resolution, billing assumes 1080p for models that support it and otherwise the largest supported resolution.

`resolution` and `video_input` are reported alongside `tokens` and may be used in a price expression. The plugin applies no multiplier of its own, so a reference-video request is charged only through the larger `tokens` value.

Set a price per model for every resolution and video-input combination the model supports.

## Example

    curl https://gateway.example.com/api/v3/contents/generations/tasks \
      -H "Authorization: Bearer sk-..." \
      -H "Content-Type: application/json" \
      -d '{"model": "doubao-seedance-2-5-260628", "content": [{"type": "text", "text": "A cat on a windowsill at sunrise"}]}'

Then poll the returned task id:

    curl https://gateway.example.com/api/v3/contents/generations/tasks/TASK_ID \
      -H "Authorization: Bearer sk-..."

## Reference media

Put references in `content` as `image_url` or `video_url` items next to the `text` item. To reuse an earlier task, add a `draft_task` item; the plugin replaces its id with the upstream task id before submitting.

    {"type": "draft_task", "draft_task": {"id": "TASK_ID"}}

## Limits

- `model` is required and `content` must be an array with at least one object item.
- On the native task route, `callback_url` is rejected; poll the task instead.
- `resolution` must be one of the values listed for the model. A `size` in `width x height` form is mapped to the matching resolution.
- `seconds` accepts `-1` for automatic duration or a positive number. The OpenAI-compatible video protocol caps it at 3600.
- Reference media must be URLs. Multipart file uploads are rejected.
- A `draft_task` reference works only while the gateway can still resolve the earlier task.
