---
changelogVersion: 1
plugin: "visduo_ais-seedance-video-t1"
version: "1.2.0"
locale: "en"
translations:
  zh-CN: CHANGELOG.zh-CN.md
---
# Changelog

## [1.2.0]

### Added

- Generate videos with the `doubao-seedance-2-0-260128`, `doubao-seedance-2-0-fast-260128`, `doubao-seedance-2-0-mini-260615`, `doubao-seedance-2-5-260628` and `doubao-seedance-2-5-flash-261115` models, each with its own resolutions and reference-video support.
- Accept vendor-style submissions at `POST /api/v3/contents/generations/tasks` and expose task status at `GET /api/v3/contents/generations/tasks/{task_id}`.
- Serve the `openai_responses` protocol with streaming, synchronous and background modes, and the OpenAI-compatible `openai_video` protocol.
- Reference an earlier task through a `draft_task` content item, which is rewritten to the upstream task id before submission.
- Report `tokens`, `resolution` and `video_input` usage facts.
- List the generated video and its last frame as downloadable artifacts.

- Bill a reference video by adding the model's longest duration to the token estimate, instead of applying a `video_input_ratio` multiplier.
- Read the top-level `resolution` field, so the OpenAI-compatible video protocol reserves the requested tier.
