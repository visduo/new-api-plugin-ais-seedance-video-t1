const VIDEO_MODELS = {
    "doubao-seedance-2-0-260128": { resolutions: ["480p", "720p", "1080p", "4k"], maxDuration: 15, videoInput: true },
    "doubao-seedance-2-0-fast-260128": { resolutions: ["480p", "720p"], maxDuration: 15, videoInput: true },
    "doubao-seedance-2-0-mini-260615": { resolutions: ["480p", "720p"], maxDuration: 15, videoInput: true },
    "doubao-seedance-2-5-260628": { resolutions: ["480p", "720p", "1080p"], maxDuration: 30, videoInput: true },
    "doubao-seedance-2-5-flash-261115": { resolutions: ["480p", "720p"], maxDuration: 30, videoInput: true },
};
const SEEDANCE_RESOLUTIONS = ["480p", "720p", "1080p", "4k"];
const DEFAULT_VIDEO_PROFILE = { resolutions: SEEDANCE_RESOLUTIONS, maxDuration: 30, videoInput: true };

function seedanceUsageSchema(profile) {
    const resolutionLabels = {};
    for (const resolution of profile.resolutions) resolutionLabels[resolution] = { en: resolution, zh: resolution };
    const schema = {
        tokens: {
            type: "number",
            unit: "token",
            description: { en: "Billing token unit price", zh: "计费 Token 单价" },
        },
        resolution: {
            enum: profile.resolutions,
            enumLabels: resolutionLabels,
            description: { en: "Output video resolution", zh: "输出视频分辨率" },
        },
    };
    if (profile.videoInput) {
        schema.video_input = {
            enum: ["none", "video"],
            enumLabels: { none: { en: "No reference video", zh: "无参考视频" }, video: { en: "With reference video", zh: "有参考视频" } },
            description: { en: "Reference video input", zh: "参考视频输入" },
        };
    }
    return schema;
}

function seedanceUsageExamples(profile) {
    const specs = profile.resolutions.map((resolution) => ({
        label: resolution + " · 5s",
        resolution: resolution,
        seconds: 5,
    }));
    if (profile.videoInput) specs.push({ label: "720p · 5s (+4s 输入视频)", resolution: "720p", seconds: 9, video_input: "video" });
    return specs.map((spec) => {
        const facts = { tokens: Math.round(estimateTokens(spec.seconds, spec.resolution)), resolution: spec.resolution };
        if (profile.videoInput) facts.video_input = spec.video_input || "none";
        return { label: spec.label, facts: facts };
    });
}

function capabilityUsageProfiles(models, usageSchema, usageExamples) {
    const profiles = [];
    for (const model of Object.keys(models)) {
        const schema = usageSchema(models[model]);
        const examples = usageExamples(models[model]);
        const shape = JSON.stringify([schema, examples]);
        let profile = profiles.find((entry) => entry.shape === shape);
        if (!profile) {
            profile = { shape: shape, models: [], schema: schema, examples: examples };
            profiles.push(profile);
        }
        profile.models.push(model);
    }
    return profiles.map((profile) => ({ models: profile.models, schema: profile.schema, examples: profile.examples }));
}

export const meta = {
    apiVersion: 1,
    key: "visduo_ais-seedance-video-t1",
    name: "EchoStack Seedance Video Generations T1",
    description: {
        en: "EchoStack Seedance video generation T1",
        zh: "EchoStack 火山引擎豆包 Seedance 视频生成"
    },
    version: "1.1.1",
    author: {
        name: "多栈科技"
    },
    website: "https://www.echostack.net/",
    models: [
        "doubao-seedance-2-0-260128",
        "doubao-seedance-2-0-fast-260128",
        "doubao-seedance-2-0-mini-260615",
        "doubao-seedance-2-5-260628",
        "doubao-seedance-2-5-flash-261115"
    ],
    fetchMode: "per_task",
    upstreams: [
        "vendor",
        "new_api"
    ],
    requiredCapabilities: [
        "duration-auto@1"
    ],
    usageSchema: {
        tokens: {
            type: "number",
            unit: "token",
            description: {
                en: "Billing token unit price",
                zh: "计费 Token 单价"
            }
        },
        resolution: {
            enum: [
                "480p",
                "720p",
                "1080p",
                "4k"
            ],
            enumLabels: {
                "480p": {
                    en: "480p",
                    zh: "480p"
                },
                "720p": {
                    en: "720p",
                    zh: "720p"
                },
                "1080p": {
                    en: "1080p",
                    zh: "1080p"
                },
                "4k": {
                    en: "4k",
                    zh: "4k"
                }
            },
            description: {
                en: "Output video resolution",
                zh: "输出视频分辨率"
            }
        },
        video_input: {
            enum: [
                "none",
                "video"
            ],
            enumLabels: {
                none: {
                    en: "No reference video",
                    zh: "无参考视频"
                },
                video: {
                    en: "With reference video",
                    zh: "有参考视频"
                }
            },
            description: {
                en: "Reference video input",
                zh: "参考视频输入"
            }
        }
    },
    usageExamples: [
        {
            label: "480p · 5s",
            facts: {
                tokens: 48038,
                resolution: "480p",
                video_input: "none"
            }
        },
        {
            label: "720p · 5s",
            facts: {
                tokens: 108000,
                resolution: "720p",
                video_input: "none"
            }
        },
        {
            label: "1080p · 5s",
            facts: {
                tokens: 243000,
                resolution: "1080p",
                video_input: "none"
            }
        },
        {
            label: "4k · 5s",
            facts: {
                tokens: 972000,
                resolution: "4k",
                video_input: "none"
            }
        },
        {
            label: "720p · 5s (+4s 输入视频)",
            facts: {
                tokens: 194400,
                resolution: "720p",
                video_input: "video"
            }
        }
    ],
    usageProfiles: [
        {
            models: [
                "doubao-seedance-2-0-260128"
            ],
            schema: {
                tokens: {
                    type: "number",
                    unit: "token",
                    description: {
                        en: "Billing token unit price",
                        zh: "计费 Token 单价"
                    }
                },
                resolution: {
                    enum: [
                        "480p",
                        "720p",
                        "1080p",
                        "4k"
                    ],
                    enumLabels: {
                        "480p": {
                            en: "480p",
                            zh: "480p"
                        },
                        "720p": {
                            en: "720p",
                            zh: "720p"
                        },
                        "1080p": {
                            en: "1080p",
                            zh: "1080p"
                        },
                        "4k": {
                            en: "4k",
                            zh: "4k"
                        }
                    },
                    description: {
                        en: "Output video resolution",
                        zh: "输出视频分辨率"
                    }
                },
                video_input: {
                    enum: [
                        "none",
                        "video"
                    ],
                    enumLabels: {
                        none: {
                            en: "No reference video",
                            zh: "无参考视频"
                        },
                        video: {
                            en: "With reference video",
                            zh: "有参考视频"
                        }
                    },
                    description: {
                        en: "Reference video input",
                        zh: "参考视频输入"
                    }
                }
            },
            examples: [
                {
                    label: "480p · 5s",
                    facts: {
                        tokens: 48038,
                        resolution: "480p",
                        video_input: "none"
                    }
                },
                {
                    label: "720p · 5s",
                    facts: {
                        tokens: 108000,
                        resolution: "720p",
                        video_input: "none"
                    }
                },
                {
                    label: "1080p · 5s",
                    facts: {
                        tokens: 243000,
                        resolution: "1080p",
                        video_input: "none"
                    }
                },
                {
                    label: "4k · 5s",
                    facts: {
                        tokens: 972000,
                        resolution: "4k",
                        video_input: "none"
                    }
                },
                {
                    label: "720p · 5s (+4s 输入视频)",
                    facts: {
                        tokens: 194400,
                        resolution: "720p",
                        video_input: "video"
                    }
                }
            ]
        },
        {
            models: [
                "doubao-seedance-2-0-fast-260128",
                "doubao-seedance-2-0-mini-260615",
                "doubao-seedance-2-5-flash-261115"
            ],
            schema: {
                tokens: {
                    type: "number",
                    unit: "token",
                    description: {
                        en: "Billing token unit price",
                        zh: "计费 Token 单价"
                    }
                },
                resolution: {
                    enum: [
                        "480p",
                        "720p"
                    ],
                    enumLabels: {
                        "480p": {
                            en: "480p",
                            zh: "480p"
                        },
                        "720p": {
                            en: "720p",
                            zh: "720p"
                        }
                    },
                    description: {
                        en: "Output video resolution",
                        zh: "输出视频分辨率"
                    }
                },
                video_input: {
                    enum: [
                        "none",
                        "video"
                    ],
                    enumLabels: {
                        none: {
                            en: "No reference video",
                            zh: "无参考视频"
                        },
                        video: {
                            en: "With reference video",
                            zh: "有参考视频"
                        }
                    },
                    description: {
                        en: "Reference video input",
                        zh: "参考视频输入"
                    }
                }
            },
            examples: [
                {
                    label: "480p · 5s",
                    facts: {
                        tokens: 48038,
                        resolution: "480p",
                        video_input: "none"
                    }
                },
                {
                    label: "720p · 5s",
                    facts: {
                        tokens: 108000,
                        resolution: "720p",
                        video_input: "none"
                    }
                },
                {
                    label: "720p · 5s (+4s 输入视频)",
                    facts: {
                        tokens: 194400,
                        resolution: "720p",
                        video_input: "video"
                    }
                }
            ]
        },
        {
            models: [
                "doubao-seedance-2-5-260628"
            ],
            schema: {
                tokens: {
                    type: "number",
                    unit: "token",
                    description: {
                        en: "Billing token unit price",
                        zh: "计费 Token 单价"
                    }
                },
                resolution: {
                    enum: [
                        "480p",
                        "720p",
                        "1080p"
                    ],
                    enumLabels: {
                        "480p": {
                            en: "480p",
                            zh: "480p"
                        },
                        "720p": {
                            en: "720p",
                            zh: "720p"
                        },
                        "1080p": {
                            en: "1080p",
                            zh: "1080p"
                        }
                    },
                    description: {
                        en: "Output video resolution",
                        zh: "输出视频分辨率"
                    }
                },
                video_input: {
                    enum: [
                        "none",
                        "video"
                    ],
                    enumLabels: {
                        none: {
                            en: "No reference video",
                            zh: "无参考视频"
                        },
                        video: {
                            en: "With reference video",
                            zh: "有参考视频"
                        }
                    },
                    description: {
                        en: "Reference video input",
                        zh: "参考视频输入"
                    }
                }
            },
            examples: [
                {
                    label: "480p · 5s",
                    facts: {
                        tokens: 48038,
                        resolution: "480p",
                        video_input: "none"
                    }
                },
                {
                    label: "720p · 5s",
                    facts: {
                        tokens: 108000,
                        resolution: "720p",
                        video_input: "none"
                    }
                },
                {
                    label: "1080p · 5s",
                    facts: {
                        tokens: 243000,
                        resolution: "1080p",
                        video_input: "none"
                    }
                },
                {
                    label: "720p · 5s (+4s 输入视频)",
                    facts: {
                        tokens: 194400,
                        resolution: "720p",
                        video_input: "video"
                    }
                }
            ]
        }
    ],
    routes: [
        {
            method: "POST",
            path: "/api/v3/contents/generations/tasks",
            type: "submit",
            decode: "createTask",
            render: "taskCreated"
        },
        {
            method: "GET",
            path: "/api/v3/contents/generations/tasks/:task_id",
            type: "query",
            render: "taskStatus"
        }
    ],
    protocols: [
        {
            name: "openai_responses",
            supports: [
                "stream",
                "sync",
                "background"
            ]
        },
        {
            name: "openai_video",
            models: [
                "doubao-seedance-2-0-260128",
                "doubao-seedance-2-0-fast-260128",
                "doubao-seedance-2-0-mini-260615",
                "doubao-seedance-2-5-260628",
                "doubao-seedance-2-5-flash-261115"
            ]
        }
    ]
};

function trimmed(value) {
    return String(value || "").trim();
}

function apiRoot(ctx) {
    return ctx.baseUrl + (ctx.upstream && ctx.upstream.kind === "new_api" ? "/doubao" : "");
}

function draftTaskIds(content) {
    const ids = [];
    if (!Array.isArray(content)) return ids;
    for (const item of content) {
        if (!item || typeof item !== "object" || Array.isArray(item)) continue;
        if (item.type !== "draft_task") continue;
        const draft = item.draft_task;
        if (!draft || typeof draft !== "object" || Array.isArray(draft)) continue;
        const id = trimmed(draft.id);
        if (id) ids.push(id);
    }
    return ids;
}

function rewriteDraftTaskContent(content, originTasks) {
    if (!Array.isArray(content)) return content;
    return content.map(function (item) {
        if (!item || typeof item !== "object" || Array.isArray(item) || item.type !== "draft_task") return item;
        const draft = item.draft_task;
        if (!draft || typeof draft !== "object" || Array.isArray(draft) || !trimmed(draft.id)) return item;
        const publicId = trimmed(draft.id);
        let upstream = "";
        if (Array.isArray(originTasks)) {
            for (const task of originTasks) {
                if (task && task.taskId === publicId) {
                    upstream = trimmed(task.upstreamTaskId);
                    break;
                }
            }
        }
        if (!upstream) throw new Error("origin task is unavailable");
        return Object.assign({}, item, { draft_task: Object.assign({}, draft, { id: upstream }) });
    });
}

function normalizeResolution(value) {
    const raw = trimmed(value).toLowerCase();
    if (["480p", "720p", "1080p", "4k"].includes(raw)) return raw;
    const parts = raw.replace("*", "x").split("x");
    if (parts.length !== 2) return "720p";
    const max = Math.max(Number(parts[0]), Number(parts[1]));
    if (max >= 3840) return "4k";
    if (max >= 1920) return "1080p";
    if (max >= 1280) return "720p";
    return "480p";
}

function hasVideo(content) {
    return Array.isArray(content) && content.some((item) => item && (item.type === "video_url" || Object.prototype.hasOwnProperty.call(item, "video_url")));
}

function videoProfile(ctx) {
    for (const model of [ctx && ctx.upstreamModel, ctx && ctx.model].map(trimmed)) {
        if (Object.prototype.hasOwnProperty.call(VIDEO_MODELS, model)) return VIDEO_MODELS[model];
    }
    return DEFAULT_VIDEO_PROFILE;
}

function videoResolution(ctx) {
    const req = ctx.requestBody || {};
    const metadata = req.vendorBody || req.metadata || {};
    const profile = videoProfile(ctx);
    const raw = trimmed(metadata.resolution || req.size).toLowerCase();
    const recognized = SEEDANCE_RESOLUTIONS.includes(raw) || raw.replace("*", "x").split("x").length === 2;
    if (!recognized) return profile.resolutions.includes("1080p") ? "1080p" : profile.resolutions[profile.resolutions.length - 1];
    const resolution = normalizeResolution(raw);
    if (!profile.resolutions.includes(resolution))
        throw new Error(trimmed(ctx.upstreamModel || ctx.model) + " resolution must be one of " + profile.resolutions.join(", "));
    return resolution;
}

function resolutionMaxPixels(resolution) {
    if (resolution === "480p") return [854, 480];
    if (resolution === "1080p") return [1920, 1080];
    if (resolution === "4k") return [3840, 2160];
    return [1280, 720];
}

function estimateTokens(seconds, resolution) {
    const dims = resolutionMaxPixels(resolution);
    return (seconds * dims[0] * dims[1] * 24) / 1024;
}

function videoInputRatio(model, resolution, content) {
    const video = hasVideo(content);
    const res = trimmed(resolution).toLowerCase();
    if (model === "doubao-seedance-2-5-260628") {
        if (res === "1080p") return video ? 7.0 / 10.7 : 11.7 / 10.7;
        return video ? 42 / 70 : 1;
    }
    if (model === "doubao-seedance-2-0-260128") {
        if (res === "1080p") return video ? 31 / 46 : 51 / 46;
        if (res === "4k") return video ? 16 / 46 : 26 / 46;
        return video ? 28 / 46 : 1;
    }
    if (model === "doubao-seedance-2-0-fast-260128") return video ? 22 / 37 : 1;
    if (model === "doubao-seedance-2-0-mini-260615") return video ? 14 / 23 : 1;
    return 1;
}

function responsesInput(req) {
    const texts = [],
        images = [];
    const input = req.input;
    if (typeof input === "string") texts.push(input);
    else if (Array.isArray(input)) {
        for (const item of input) {
            if (typeof item === "string") {
                texts.push(item);
                continue;
            }
            if (!item || typeof item !== "object" || Array.isArray(item)) continue;
            const content = item.content === undefined ? [item] : Array.isArray(item.content) ? item.content : [item.content];
            for (const part of content) {
                if (typeof part === "string") {
                    texts.push(part);
                    continue;
                }
                if (!part || typeof part !== "object" || Array.isArray(part)) continue;
                if (["input_text", "text"].includes(part.type) && typeof part.text === "string") texts.push(part.text);
                if (["input_image", "image_url"].includes(part.type)) {
                    let image = part.image_url;
                    if (image && typeof image === "object") image = image.url;
                    if (trimmed(image)) images.push(trimmed(image));
                }
            }
        }
    }
    return {
        prompt: texts
            .filter(function (text) {
                return trimmed(text);
            })
            .join("\n"),
        images: images,
    };
}

function responsesVideoText(ctx) {
    const artifact = ctx && ctx.artifacts && ctx.artifacts.video;
    const url = trimmed(artifact && artifact.url);
    if (!url) throw new Error("video artifact is unavailable");
    const escaped = url.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return '<video controls src="' + escaped + '"></video>';
}

const ERROR_CODES = {
    400: "InvalidParameter",
    401: "AuthenticationError",
    403: "AccessDenied",
    404: "NotFound",
    408: "RequestTimeout",
    413: "InvalidParameter",
    429: "AccountRateLimitExceeded",
};

export const native = {
    createTask: function (ctx) {
        if (!ctx.body || ctx.body.kind !== "json") throw new Error("JSON body required");
        const body = ctx.body.value;
        if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("request body must be an object");
        const model = trimmed(body.model);
        if (!model) throw new Error("model is required");
        if (body.callback_url !== undefined && body.callback_url !== null) throw new Error("callback_url is not supported; query the task instead");
        if (body.content !== undefined && !Array.isArray(body.content)) throw new Error("content must be an array");
        if (!(body.content || []).some((item) => item && typeof item === "object" && !Array.isArray(item))) throw new Error("content is required");
        const hasReference = body.content.some((item) => item && typeof item === "object" && item.type !== "text");
        const intent = { kind: "submit", model: model, action: hasReference ? "image_to_video" : "text_to_video", requestBody: { model: model, vendorBody: body } };
        const originTaskIds = draftTaskIds(body.content);
        if (originTaskIds.length) intent.originTaskIds = originTaskIds;
        return intent;
    },
    taskCreated: function (ctx, task) {
        const data = task.data && typeof task.data === "object" && !Array.isArray(task.data) ? task.data : {};
        return Object.assign({}, data, { id: task.task_id });
    },
    taskStatus: function (ctx, task) {
        const statusMap = { NOT_START: "queued", SUBMITTED: "queued", QUEUED: "queued", RUNNING: "running", PROCESSING: "running", IN_PROGRESS: "running", SUCCESS: "succeeded", FAILURE: "failed" };
        const data = task.data && typeof task.data === "object" && !Array.isArray(task.data) ? task.data : {};
        const output = Object.assign({}, data, { id: task.task_id });
        if (typeof output.status !== "string") output.status = statusMap[task.status] || "queued";
        if (task.status === "FAILURE" && (output.status === "queued" || output.status === "running")) {
            output.status = "failed";
            output.error = { code: "InternalServiceError", message: task.fail_reason || "task failed" };
        }
        return output;
    },
    error: function (ctx, error) {
        return { error: { code: ERROR_CODES[error.httpStatus] || "InternalServiceError", message: error.message } };
    },
};

export function buildSubmitRequest(ctx) {
    const req = ctx.requestBody;
    videoResolution(ctx);
    if (req.vendorBody) {
        const sent = Object.assign({}, req.vendorBody, { model: ctx.upstreamModel || req.vendorBody.model });
        sent.content = rewriteDraftTaskContent(sent.content, ctx.originTasks);
        return {
            url: apiRoot(ctx) + "/api/v3/contents/generations/tasks",
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: "Bearer " + ctx.apiKey },
            body: sent,
            action: sent.content.some((item) => item && typeof item === "object" && item.type !== "text") ? "image_to_video" : "text_to_video",
            rewriteModel: sent.model,
        };
    }
    const metadata = req.metadata || {};
    const body = Object.assign({ model: req.model || "", content: [] }, metadata);
    const imageContent = [];
    const images = Array.isArray(req.images) ? req.images : [];
    for (const url of images) imageContent.push({ type: "image_url", image_url: { url: url } });
    const metadataContent = Array.isArray(body.content) ? body.content : [];
    body.content = imageContent.concat(metadataContent).filter((item) => item && item.type !== "text");
    const hasReference = body.content.length > 0;
    if (trimmed(req.prompt) || !hasReference) body.content.push({ type: "text", text: req.prompt || "" });
    if (Array.isArray(body.content)) body.content = rewriteDraftTaskContent(body.content, ctx.originTasks);
    const seconds = Number.parseInt(req.seconds || "", 10);
    if (seconds > 0 || seconds === -1) body.duration = seconds;
    body.model = ctx.upstreamModel || body.model;
    return {
        url: apiRoot(ctx) + "/api/v3/contents/generations/tasks",
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: "Bearer " + ctx.apiKey },
        body: body,
        action: hasReference ? "image_to_video" : "text_to_video",
        rewriteModel: body.model,
    };
}

export function parseSubmitResponse(ctx, resp) {
    if (!resp.body || !resp.body.id) throw new Error("task_id is empty");
    return { taskId: resp.body.id, taskData: resp.body };
}

export function extractUsage(ctx) {
    const req = ctx.requestBody || {};
    const metadata = req.vendorBody || req.metadata || {};
    if (ctx.usagePurpose === "billing_ratios") {
        const ratio = videoInputRatio(ctx.upstreamModel || ctx.model, metadata.resolution, metadata.content);
        return ratio === 1 ? null : { video_input_ratio: ratio };
    }
    const profile = videoProfile(ctx);
    const stated = req.seconds || req.duration || metadata.duration;
    let seconds = typeof stated === "number" || typeof stated === "string" ? Number(stated) : 0;
    if (!Number.isFinite(seconds) || seconds <= 0) {
        const frames = Number(metadata.frames);
        seconds = Number.isFinite(frames) && frames > 0 ? Math.floor(frames / 24) : profile.maxDuration;
    }
    if (seconds <= 0) seconds = 5;
    seconds = Math.min(seconds, 3600);
    const resolution = videoResolution(ctx);
    const facts = { tokens: estimateTokens(seconds, resolution), resolution: resolution };
    facts.video_input = hasVideo(metadata.content) ? "video" : "none";
    return facts;
}

export function buildQueryRequest(ctx) {
    return {
        url: apiRoot(ctx) + "/api/v3/contents/generations/tasks/" + ctx.taskId,
        method: "GET",
        headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + ctx.apiKey },
    };
}

export function parseTaskResult(ctx, body) {
    const status = trimmed(body.status).toLowerCase();
    if (["queued", "pending", "submitted", "not_start"].includes(status)) return { status: "QUEUED", progress: "10%" };
    if (["running", "processing", "in_progress"].includes(status)) {
        const progress = Number(body.progress);
        return {
            status: "IN_PROGRESS",
            progress: Number.isFinite(progress) ? String(Math.max(0, Math.min(99, Math.floor(progress)))) + "%" : "50%",
        };
    }
    if (status === "succeeded" || status === "completed" || status === "success") {
        const result = { status: "SUCCESS", progress: "100%", url: body.content && body.content.video_url ? body.content.video_url : "" };
        const usage = body.usage || {};
        // Compatible gateways report the bill as total_tokens on completed replies.
        const completionTokens = Number(usage.completion_tokens || (status === "completed" ? usage.total_tokens : 0));
        const totalTokens = Number(usage.total_tokens || (status === "completed" ? usage.completion_tokens : 0));
        if (Number.isFinite(completionTokens) && completionTokens > 0) result.completionTokens = completionTokens;
        if (Number.isFinite(totalTokens) && totalTokens > 0) result.totalTokens = totalTokens;
        return result;
    }
    if (status === "failed" || status === "expired" || status === "cancelled") {
        const reason = body.error && body.error.message ? body.error.message : body.status;
        return { status: "FAILURE", progress: "100%", reason: reason };
    }
    return { status: "UNKNOWN", reason: "unrecognized status: " + String(body.status || "") };
}

function artifactData(ctx) {
    const data = (ctx && ctx.data) || {};
    if (data.data && typeof data.data === "object" && data.data.task_id && Object.prototype.hasOwnProperty.call(data.data, "data")) return data.data.data || {};
    return data;
}

export function listArtifacts(task) {
    if (task.status !== "SUCCESS") return [];
    const data = artifactData(task);
    const content = data.content || {};
    const artifacts = [];
    if (trimmed(content.video_url)) artifacts.push({ key: "video", type: "video" });
    if (trimmed(content.last_frame_url)) artifacts.push({ key: "last_frame", type: "image", mimeType: "image/png" });
    return artifacts;
}

export function buildContentRequest(ctx) {
    const data = artifactData(ctx);
    const content = data.content || {};
    const urls = { video: content.video_url, last_frame: content.last_frame_url };
    const url = trimmed(urls[ctx.artifactKey]);
    if (!url) throw new Error("artifact_not_found");
    return { url: url, method: ctx.clientRequest.method, credentialless: true };
}

export function extractUsageOnComplete(task, taskResult, body) {
    if (!body) return {};
    const status = trimmed(body.status).toLowerCase();
    if (!["succeeded", "completed", "success"].includes(status)) return {};
    const facts = {};
    const usage = body.usage || {};
    // Compatible gateways report the bill as total_tokens on completed replies.
    const preferred = status === "completed" ? usage.total_tokens : usage.completion_tokens;
    const fallback = status === "completed" ? usage.completion_tokens : usage.total_tokens;
    let tokens = Number(preferred);
    if (!Number.isFinite(tokens) || tokens <= 0) tokens = Number(fallback);
    if (Number.isFinite(tokens) && tokens > 0) facts.tokens = tokens;
    const content = body.content || {};
    const resolution = trimmed(content.resolution || body.resolution).toLowerCase();
    if (videoProfile(task).resolutions.includes(resolution)) facts.resolution = resolution;
    return facts;
}

export const protocols = {
    openai_responses: {
        decodeRequest: function (ctx) {
            if (!ctx.body || ctx.body.kind !== "json") throw new Error("JSON body required");
            const req = ctx.body.value;
            if (!req || typeof req !== "object" || Array.isArray(req)) throw new Error("request body must be an object");
            const model = trimmed(req.model);
            if (!model) throw new Error("model is required");
            if (req.input !== undefined && typeof req.input !== "string" && !Array.isArray(req.input)) throw new Error("input must be a string or array");
            if (req.images !== undefined && !Array.isArray(req.images)) throw new Error("images must be an array");
            const input = responsesInput(req);
            if (req.metadata !== undefined && (!req.metadata || typeof req.metadata !== "object" || Array.isArray(req.metadata)))
                throw new Error("metadata must be an object");
            const prompt = input.prompt || trimmed(req.prompt);
            const images = [];
            for (const image of [req.image, req.input_reference].concat(req.images || [], input.images)) {
                if (trimmed(image) && !images.includes(trimmed(image))) images.push(trimmed(image));
            }
            if (!prompt && images.length === 0) throw new Error("input is required");
            const metadata = Object.assign({}, req.metadata || {});
            if (Object.prototype.hasOwnProperty.call(req, "resolution")) metadata.resolution = req.resolution;
            else if (req.size && !metadata.resolution) metadata.resolution = normalizeResolution(req.size);
            const requestBody = { model: model, prompt: prompt, metadata: metadata };
            if (images.length) requestBody.images = images;
            if (Object.prototype.hasOwnProperty.call(req, "seconds")) requestBody.seconds = req.seconds;
            else if (Object.prototype.hasOwnProperty.call(req, "duration")) requestBody.seconds = req.duration;
            if (Object.prototype.hasOwnProperty.call(req, "size")) requestBody.size = req.size;
            const intent = { kind: "submit", model: model, action: images.length ? "image_to_video" : "text_to_video", requestBody: requestBody };
            const originTaskIds = draftTaskIds(metadata.content);
            if (originTaskIds.length) intent.originTaskIds = originTaskIds;
            return intent;
        },
        renderEvents: function (ctx, task, previousState) {
            const status = String(task.status || "UNKNOWN").toUpperCase();
            const value = Number(String(task.progress || "").replace("%", ""));
            const progress = Number.isFinite(value) && value >= 0 && value <= 100 ? value : null;
            const state = { status: status, progress: progress };
            if (status === "SUCCESS") {
                const text = responsesVideoText(ctx);
                const events = previousState && previousState.status === status ? [] : [{ type: "output", data: text }];
                return { events: events, state: state, done: true };
            }
            if (status === "FAILURE")
                return { events: [{ type: "error", code: "task_failed", message: task.fail_reason || "task failed" }], state: state, done: true };
            if (previousState && previousState.status === status && previousState.progress === progress) return { events: [], state: state, done: false };
            const event = { type: "progress", message: status.toLowerCase() };
            if (progress !== null) event.progress = progress;
            return { events: [event], state: state, done: false };
        },
        renderFinal: function (ctx, task) {
            return {
                output: [
                    {
                        type: "message",
                        status: "completed",
                        role: "assistant",
                        content: [{ type: "output_text", text: responsesVideoText(ctx), annotations: [], logprobs: [] }],
                    },
                ],
                metadata: { vendor: "doubao" },
            };
        },
    },
};

const legacyRenderers = {
    openai_video: function (task) {
        const data = task.data || {};
        const statusMap = {
            NOT_START: "queued",
            SUBMITTED: "queued",
            QUEUED: "queued",
            RUNNING: "in_progress",
            PROCESSING: "in_progress",
            IN_PROGRESS: "in_progress",
            SUCCESS: "completed",
            FAILURE: "failed",
        };
        const output = {
            id: task.task_id,
            object: "video",
            model: task.properties ? task.properties.origin_model_name || "" : "",
            status: statusMap[task.status] || "unknown",
            progress: Number(String(task.progress || "0").replace("%", "")),
            created_at: task.created_at,
            completed_at: task.updated_at,
        };
        if (data.status === "failed") output.error = { message: data.error ? data.error.message || "" : "", code: data.error ? data.error.code || "" : "" };
        return output;
    },
};

protocols.openai_video = {
    decodeRequest: function (ctx) {
        if (!ctx.body || (ctx.body.kind !== "json" && ctx.body.kind !== "multipart")) throw new Error("JSON or multipart body required");
        if (ctx.body.kind === "json") {
            if (!ctx.body.value || Array.isArray(ctx.body.value)) throw new Error("JSON object required");
            const req = ctx.body.value;
            const seconds = req.seconds === undefined ? req.duration : req.seconds;
            if (seconds !== undefined && Number(seconds) !== -1 && (!Number.isFinite(Number(seconds)) || Number(seconds) <= 0 || Number(seconds) > 3600))
                throw new Error("seconds must be -1 or between 1 and 3600");
            const requestBody = Object.assign({}, req, { model: ctx.model });
            delete requestBody.vendorBody;
            if (seconds !== undefined) requestBody.seconds = seconds;
            return {
                kind: "submit",
                model: ctx.model,
                action: req.input_reference || req.image ? "image_to_video" : "text_to_video",
                requestBody: requestBody,
            };
        }
        const first = function (name) {
            const values = (ctx.body.fields || {})[name] || [];
            if (values.length > 1) throw new Error(name + " must be provided once");
            return values[0];
        };
        const req = {};
        const fields = ctx.body.fields || {};
        for (const name of Object.keys(fields)) {
            req[name] = first(name);
        }
        if (req.metadata !== undefined) {
            let parsed;
            try {
                parsed = JSON.parse(req.metadata);
            } catch (e) {
                throw new Error("metadata must be a JSON object string");
            }
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("metadata must be a JSON object string");
            req.metadata = parsed;
        }
        if ((ctx.body.files || []).length) throw new Error("Doubao requires image and video references to be URLs inside metadata.content");
        if (req.seconds !== undefined) req.seconds = Number(req.seconds);
        else if (req.duration !== undefined) req.seconds = Number(req.duration);
        const seconds = req.seconds === undefined ? req.duration : req.seconds;
        if (seconds !== undefined && Number(seconds) !== -1 && (!Number.isFinite(Number(seconds)) || Number(seconds) <= 0 || Number(seconds) > 3600))
            throw new Error("seconds must be -1 or between 1 and 3600");
        delete req.vendorBody;
        return {
            kind: "submit",
            model: ctx.model,
            action: req.input_reference || req.image ? "image_to_video" : "text_to_video",
            requestBody: Object.assign({}, req, { model: ctx.model }),
        };
    },
    render: function (ctx, task) {
        return legacyRenderers.openai_video(task);
    },
};
