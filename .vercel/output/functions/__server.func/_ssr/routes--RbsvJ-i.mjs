import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as GitBranch, i as Leaf, n as Trees, o as Flower2, r as Shuffle, s as Expand } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes--RbsvJ-i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REACH_MIN = 12;
var REACH_MAX = 46;
var AGE_MIN = 5;
var AGE_MAX = 11;
var CONDITIONS = [
	{
		key: "angle",
		label: "Reach",
		min: REACH_MIN,
		max: REACH_MAX,
		step: 1,
		format: (v) => v < 20 ? "narrow" : v > 34 ? "wide" : "open"
	},
	{
		key: "depth",
		label: "Age",
		min: AGE_MIN,
		max: AGE_MAX,
		step: 1,
		format: (v) => `${Math.round(v)} seasons`
	},
	{
		key: "length",
		label: "Vigor",
		min: .7,
		max: 1.4,
		step: .01,
		format: (v) => v < .88 ? "spare" : v > 1.18 ? "vigorous" : "steady"
	},
	{
		key: "wind",
		label: "Weather",
		min: 0,
		max: 1,
		step: .01,
		format: (v) => v < .22 ? "still" : v > .62 ? "rough" : "light"
	}
];
var STARTING = {
	angle: 26,
	depth: 9,
	length: 1,
	wind: .42,
	overlay: "leaves"
};
var FRACTAL_KINDS = [
	{
		id: "grove",
		name: "Grove",
		blurb: "a branching tree",
		landscape: true,
		foliage: true,
		ceiling: 13,
		load: (d, l) => Math.round(d) + (l > 1.2 ? 1 : 0),
		overlay: "leaves"
	},
	{
		id: "flame",
		name: "Flame",
		blurb: "a tongue of fire",
		landscape: true,
		foliage: false,
		ceiling: 10,
		load: (d) => Math.round(d),
		overlay: "bare"
	},
	{
		id: "frost",
		name: "Frost",
		blurb: "an ice crystal",
		landscape: false,
		foliage: false,
		ceiling: 8,
		load: (d) => Math.round(d),
		overlay: "bare"
	},
	{
		id: "bolt",
		name: "Bolt",
		blurb: "a lightning fork",
		landscape: true,
		foliage: false,
		ceiling: 9,
		load: (d) => Math.round(d),
		overlay: "bare"
	},
	{
		id: "delta",
		name: "Delta",
		blurb: "a river branching to the sea",
		landscape: true,
		foliage: false,
		ceiling: 10,
		load: (d) => Math.round(d),
		overlay: "bare"
	},
	{
		id: "crystal",
		name: "Crystal",
		blurb: "a mineral cluster",
		landscape: true,
		foliage: false,
		ceiling: 8,
		load: (d) => Math.round(d),
		overlay: "bare"
	},
	{
		id: "shell",
		name: "Shell",
		blurb: "a chambered spiral",
		landscape: true,
		foliage: false,
		ceiling: 12,
		load: (d) => Math.round(d),
		overlay: "bare"
	},
	{
		id: "mycelium",
		name: "Mycelium",
		blurb: "an underground network",
		landscape: true,
		foliage: true,
		cutaway: true,
		ceiling: 11,
		load: (d) => Math.round(d),
		overlay: "blossoms"
	},
	{
		id: "feather",
		name: "Feather",
		blurb: "a pinnate vane",
		landscape: true,
		foliage: true,
		ceiling: 10,
		load: (d) => Math.round(d),
		overlay: "leaves"
	}
];
function getKind(id) {
	return FRACTAL_KINDS.find((k) => k.id === id) ?? FRACTAL_KINDS[0];
}
function growthCap(kind, depth, length) {
	const meta = getKind(kind);
	return Math.max(1, meta.ceiling - meta.load(depth, length));
}
function map(v, a0, a1, b0, b1) {
	const t = (v - a0) / Math.max(1e-6, a1 - a0);
	return b0 + Math.max(0, Math.min(1, t)) * (b1 - b0);
}
/** Map shared starting conditions into the math each form actually uses. */
function emergeParams(kind, angle, depth, length, wind) {
	switch (kind) {
		case "frost": return {
			angle: Math.round(map(angle, REACH_MIN, REACH_MAX, 4, 8)),
			depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 2, 6)),
			length,
			wind
		};
		case "flame": return {
			angle: map(angle, REACH_MIN, REACH_MAX, 10, 38),
			depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 4, 9)),
			length,
			wind
		};
		case "bolt": return {
			angle,
			depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 3, 8)),
			length,
			wind
		};
		case "delta": return {
			angle: map(angle, REACH_MIN, REACH_MAX, 12, 42),
			depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 3, 8)),
			length,
			wind
		};
		case "crystal": return {
			angle: Math.round(map(angle, REACH_MIN, REACH_MAX, 4, 8)),
			depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 2, 6)),
			length,
			wind
		};
		case "shell": return {
			angle: map(angle, REACH_MIN, REACH_MAX, .12, .28),
			depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 8, 18)),
			length,
			wind
		};
		case "mycelium": return {
			angle,
			depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 3, 9)),
			length,
			wind
		};
		case "feather": return {
			angle: map(angle, REACH_MIN, REACH_MAX, 12, 42),
			depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 4, 10)),
			length,
			wind
		};
		default: return {
			angle,
			depth,
			length,
			wind
		};
	}
}
function describeConditions(angle, depth, length, wind) {
	const reach = angle < 20 ? "narrow" : angle > 34 ? "wide" : "open";
	return `${reach === "open" ? "An" : "A"} ${reach}, ${depth <= 6 ? "young" : depth >= 10 ? "old" : "grown"}, ${length < .88 ? "spare" : length > 1.18 ? "vigorous" : "steady"} start in ${wind < .22 ? "still air" : wind > .62 ? "rough weather" : "a light wind"}.`;
}
var PALETTES = [
	{
		id: "dusk",
		name: "Dusk",
		skyTop: [
			30,
			46,
			52
		],
		skyBottom: [
			12,
			16,
			15
		],
		haze: [
			48,
			64,
			62
		],
		hillFar: [
			22,
			32,
			30
		],
		hillNear: [
			16,
			22,
			19
		],
		ground: [
			18,
			20,
			17
		],
		bark: [
			92,
			64,
			46
		],
		barkTip: [
			122,
			92,
			64
		],
		leafA: [
			74,
			114,
			78
		],
		leafB: [
			132,
			148,
			78
		],
		blossom: [
			214,
			118,
			108
		],
		blossomAlt: [
			232,
			168,
			154
		],
		blossomCenter: [
			236,
			210,
			150
		],
		celestial: "moon",
		celestialColor: [
			232,
			228,
			214
		],
		particle: [
			236,
			220,
			170
		],
		particleCount: 22,
		vignette: [
			8,
			10,
			9
		]
	},
	{
		id: "washi",
		name: "Washi",
		skyTop: [
			244,
			236,
			220
		],
		skyBottom: [
			226,
			214,
			194
		],
		haze: [
			236,
			226,
			208
		],
		hillFar: [
			206,
			196,
			174
		],
		hillNear: [
			188,
			174,
			150
		],
		ground: [
			176,
			160,
			134
		],
		bark: [
			38,
			32,
			28
		],
		barkTip: [
			64,
			52,
			42
		],
		leafA: [
			70,
			102,
			72
		],
		leafB: [
			112,
			128,
			70
		],
		blossom: [
			186,
			62,
			50
		],
		blossomAlt: [
			214,
			110,
			88
		],
		blossomCenter: [
			236,
			196,
			120
		],
		celestial: "none",
		celestialColor: [
			186,
			62,
			50
		],
		particle: [
			120,
			90,
			70
		],
		particleCount: 16,
		vignette: [
			160,
			140,
			110
		]
	},
	{
		id: "ember",
		name: "Ember",
		skyTop: [
			72,
			40,
			28
		],
		skyBottom: [
			18,
			12,
			10
		],
		haze: [
			110,
			62,
			36
		],
		hillFar: [
			42,
			24,
			18
		],
		hillNear: [
			28,
			16,
			12
		],
		ground: [
			22,
			14,
			10
		],
		bark: [
			56,
			34,
			24
		],
		barkTip: [
			92,
			56,
			34
		],
		leafA: [
			176,
			78,
			36
		],
		leafB: [
			216,
			148,
			58
		],
		blossom: [
			228,
			188,
			96
		],
		blossomAlt: [
			210,
			110,
			54
		],
		blossomCenter: [
			248,
			224,
			160
		],
		celestial: "sun",
		celestialColor: [
			240,
			164,
			88
		],
		particle: [
			255,
			190,
			110
		],
		particleCount: 18,
		vignette: [
			10,
			6,
			4
		]
	}
];
var DEFAULT_PALETTE_ID = "dusk";
function getPalette(id) {
	return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}
var DEFAULT_SEED = 20461;
function randomSeed() {
	if (typeof crypto !== "undefined" && crypto.getRandomValues) {
		const buf = /* @__PURE__ */ new Uint32Array(1);
		crypto.getRandomValues(buf);
		return 1e5 + buf[0] % 9e5;
	}
	return 1e5 + Math.floor(Math.random() * 9e5);
}
function clampExpansion(kind, depth, length, expansion) {
	return Math.min(expansion, growthCap(kind, depth, length));
}
var useGroveStore = create((set) => ({
	seed: DEFAULT_SEED,
	kind: "grove",
	angle: STARTING.angle,
	depth: STARTING.depth,
	length: STARTING.length,
	wind: STARTING.wind,
	overlay: STARTING.overlay,
	paletteId: DEFAULT_PALETTE_ID,
	generation: 0,
	expansion: 0,
	expandPulse: false,
	regenerate: () => set((s) => ({
		seed: randomSeed(),
		expansion: 0,
		expandPulse: false,
		generation: s.generation + 1
	})),
	growAgain: () => set((s) => {
		const cap = growthCap(s.kind, s.depth, s.length);
		return {
			expansion: Math.min(cap, s.expansion + 1),
			expandPulse: true,
			generation: s.generation + 1
		};
	}),
	setKind: (kind) => set((s) => ({
		kind,
		expansion: 0,
		expandPulse: false,
		generation: s.generation + 1
	})),
	setAngle: (angle) => set({ angle }),
	setDepth: (depth) => set((s) => ({
		depth,
		expansion: clampExpansion(s.kind, depth, s.length, s.expansion)
	})),
	setLength: (length) => set((s) => ({
		length,
		expansion: clampExpansion(s.kind, s.depth, length, s.expansion)
	})),
	setWind: (wind) => set({ wind }),
	setOverlay: (overlay) => set({ overlay }),
	setPaletteId: (paletteId) => set({ paletteId })
}));
var OVERLAYS$1 = /* @__PURE__ */ new Set([
	"bare",
	"leaves",
	"blossoms",
	"both"
]);
var KINDS = new Set(FRACTAL_KINDS.map((k) => k.id));
var lastAt = 0;
var lastKey = "";
function runGroveAction(action, value) {
	const key = `${action}:${value ?? ""}`;
	const now = performance.now();
	if (key === lastKey && now - lastAt < 280) return false;
	lastKey = key;
	lastAt = now;
	const store = useGroveStore.getState();
	switch (action) {
		case "grow":
			store.growAgain();
			return true;
		case "regen":
			store.regenerate();
			return true;
		case "kind":
			if (value && KINDS.has(value)) {
				store.setKind(value);
				return true;
			}
			return false;
		case "overlay":
			if (value && OVERLAYS$1.has(value)) {
				store.setOverlay(value);
				return true;
			}
			return false;
		case "palette":
			if (value) {
				store.setPaletteId(value);
				return true;
			}
			return false;
		default: return false;
	}
}
function handleGrovePointer(event) {
	if (event.button && event.button > 0) return;
	const el = event.currentTarget;
	if (!(el instanceof HTMLElement)) return;
	const action = el.dataset.groveAction;
	if (!action) return;
	runGroveAction(action, el.dataset.groveValue);
}
function css(c, a = 1) {
	if (a >= 1) return `rgb(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0})`;
	return `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${Math.max(0, Math.min(1, a))})`;
}
function mix(a, b, t) {
	const u = Math.max(0, Math.min(1, t));
	return [
		a[0] + (b[0] - a[0]) * u,
		a[1] + (b[1] - a[1]) * u,
		a[2] + (b[2] - a[2]) * u
	];
}
function luma(c) {
	return (.2126 * c[0] + .7152 * c[1] + .0722 * c[2]) / 255;
}
function skyLuma(p) {
	return luma(mix(p.skyTop, p.skyBottom, .42));
}
/** Bark/stroke that stays readable on the current sky. */
function ink(p) {
	if (skyLuma(p) > .58) return mix(p.bark, [
		32,
		24,
		18
	], .4);
	return mix(p.bark, p.celestialColor, .2);
}
/** Lift or deepen a fill so it doesn't dissolve into the ambient. */
function wash(p, c) {
	const sky = skyLuma(p);
	if (sky < .28) return mix(c, p.celestialColor, .22);
	if (sky > .62) return mix(c, p.bark, .16);
	return mix(c, p.haze, .08);
}
function recede(p, c, t = .24) {
	return mix(c, p.skyBottom, t);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var OVERLAYS = [
	{
		id: "bare",
		label: "Bare",
		icon: GitBranch
	},
	{
		id: "leaves",
		label: "Leaves",
		icon: Leaf
	},
	{
		id: "blossoms",
		label: "Blossoms",
		icon: Flower2
	},
	{
		id: "both",
		label: "Both",
		icon: Trees
	}
];
function RangeRow({ label, value, min, max, step, onChange, display }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex min-w-0 flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium tracking-wide text-muted",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs tracking-wide text-fg",
				children: display
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			className: "grove-range",
			min,
			max,
			step,
			value,
			"aria-label": label,
			onInput: (e) => onChange(Number(e.target.value)),
			onChange: (e) => onChange(Number(e.target.value))
		})]
	});
}
function ControlPanel() {
	const kind = useGroveStore((s) => s.kind);
	const angle = useGroveStore((s) => s.angle);
	const depth = useGroveStore((s) => s.depth);
	const length = useGroveStore((s) => s.length);
	const wind = useGroveStore((s) => s.wind);
	const overlay = useGroveStore((s) => s.overlay);
	const paletteId = useGroveStore((s) => s.paletteId);
	const setAngle = useGroveStore((s) => s.setAngle);
	const setDepth = useGroveStore((s) => s.setDepth);
	const setLength = useGroveStore((s) => s.setLength);
	const setWind = useGroveStore((s) => s.setWind);
	const meta = getKind(kind);
	const values = {
		angle,
		depth,
		length,
		wind
	};
	const setters = {
		angle: setAngle,
		depth: setDepth,
		length: setLength,
		wind: setWind
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "Starting conditions",
		className: "flex w-full flex-col gap-3 rounded-3xl bg-surface p-3 shadow-[var(--shadow-border)] md:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted",
						children: "Starting conditions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display italic text-sm leading-snug text-fg",
						children: describeConditions(angle, depth, length, wind)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-x-4 gap-y-3",
						children: CONDITIONS.map((slider) => {
							const raw = values[slider.key];
							const value = Math.min(slider.max, Math.max(slider.min, raw));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeRow, {
								label: slider.label,
								display: slider.format(value),
								min: slider.min,
								max: slider.max,
								step: slider.step,
								value,
								onChange: setters[slider.key]
							}, slider.key);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted",
						children: "What emerges"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "radiogroup",
						"aria-label": "What emerges",
						className: "grid grid-cols-3 gap-1 rounded-lg bg-surface-2 p-1 sm:grid-cols-5",
						children: FRACTAL_KINDS.map((item) => {
							const active = kind === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "radio",
								"aria-checked": active,
								"aria-label": item.name,
								title: item.blurb,
								"data-grove-action": "kind",
								"data-grove-value": item.id,
								onPointerUp: handleGrovePointer,
								onClick: handleGrovePointer,
								className: cn("flex h-11 items-center justify-center rounded-md px-1 text-xs font-medium tracking-wide", active ? "bg-fg text-bg" : "text-muted hover:text-fg"),
								children: item.name
							}, item.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-subtle",
						children: [meta.blurb, " from the same start"]
					})
				]
			}),
			meta.foliage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted",
					children: "Foliage"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "radiogroup",
					"aria-label": "Foliage overlay",
					className: "grid grid-cols-4 gap-1 rounded-lg bg-surface-2 p-1",
					children: OVERLAYS.map((item) => {
						const Icon = item.icon;
						const active = overlay === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "radio",
							"aria-checked": active,
							"data-grove-action": "overlay",
							"data-grove-value": item.id,
							onPointerUp: handleGrovePointer,
							onClick: handleGrovePointer,
							className: cn("flex h-11 flex-col items-center justify-center gap-0.5 rounded-md text-xs font-medium tracking-wide", active ? "bg-fg text-bg" : "text-muted hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "pointer-events-none size-3.5",
								strokeWidth: 1.75
							}), item.label]
						}, item.id);
					})
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted",
						children: "Palette"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: PALETTES.map((p) => {
							const active = paletteId === p.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": p.name,
								"aria-pressed": active,
								title: p.name,
								"data-grove-action": "palette",
								"data-grove-value": p.id,
								onPointerUp: handleGrovePointer,
								onClick: handleGrovePointer,
								className: cn("flex h-12 flex-col overflow-hidden rounded-md", active ? "ring-2 ring-fg ring-offset-2 ring-offset-surface" : "shadow-[var(--shadow-border)] hover:opacity-90"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "pointer-events-none flex min-h-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1",
											style: { background: css(p.skyTop) }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1",
											style: { background: css(p.bark) }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1",
											style: { background: css(p.leafA) }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1",
											style: { background: css(p.blossom) }
										})
									]
								})
							}, p.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: PALETTES.find((p) => p.id === paletteId)?.name
					})
				]
			})
		]
	});
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return function next() {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function randRange(rng, min, max) {
	return min + rng() * (max - min);
}
function sway(wind, time, phase) {
	return Math.sin(time * .7 + phase) * wind * .18;
}
function extra(s) {
	return Math.max(0, s.expansion | 0);
}
function frostArm(ctx, x, y, ang, len, depth, order, t, palette, wind, time, fork) {
	if (depth > order || t <= 0 || len < 3) return;
	const wobble = Math.sin(time * .9 + depth) * wind * .12;
	const x2 = x + Math.cos(ang + wobble) * len;
	const y2 = y + Math.sin(ang + wobble) * len;
	ctx.strokeStyle = css(wash(palette, mix(palette.celestialColor, palette.leafA, depth / (order + 1))), .4 + t * .55);
	ctx.lineWidth = Math.max(.6, 2.4 - depth * .28);
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	const next = len * .52;
	frostArm(ctx, x2, y2, ang - fork, next, depth + 1, order, t - .12, palette, wind, time, fork);
	frostArm(ctx, x2, y2, ang + fork, next, depth + 1, order, t - .12, palette, wind, time, fork);
	frostArm(ctx, x2, y2, ang, next * 1.08, depth + 1, order, t - .08, palette, wind, time, fork);
}
function drawFrost(ctx, w, h, s) {
	const rng = mulberry32(s.seed >>> 0);
	const ox = w * .5;
	const oy = h * .48;
	const arms = Math.max(4, Math.min(8, Math.round(s.angle)));
	const fork = .48 + rng() * .22;
	const order = Math.max(2, Math.min(7, Math.round(s.depth) + extra(s)));
	const span = Math.min(w, h) * .22 * s.length;
	const spin = rng() * Math.PI;
	ctx.lineCap = "round";
	for (let i = 0; i < arms; i++) frostArm(ctx, ox, oy, spin + i / arms * Math.PI * 2, span, 0, order, s.growth, s.palette, s.wind, s.time, fork);
	ctx.fillStyle = css(s.palette.celestialColor, .85);
	ctx.beginPath();
	ctx.arc(ox, oy, 3.2, 0, Math.PI * 2);
	ctx.fill();
}
function lightning(ctx, x0, y0, x1, y1, jag, depth, fork, rng, palette, t) {
	if (t <= 0) return;
	const dx = x1 - x0;
	const dy = y1 - y0;
	const dist = Math.hypot(dx, dy);
	if (depth <= 0 || dist < 8) {
		ctx.strokeStyle = css(palette.celestialColor, .5 + t * .5);
		ctx.lineWidth = Math.max(1.4, 7 - depth);
		ctx.beginPath();
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);
		ctx.stroke();
		return;
	}
	const mx = (x0 + x1) / 2 + (rng() - .5) * jag * dist;
	const my = (y0 + y1) / 2 + (rng() - .5) * jag * dist * .55;
	lightning(ctx, x0, y0, mx, my, jag * .7, depth - 1, fork, rng, palette, t);
	lightning(ctx, mx, my, x1, y1, jag * .7, depth - 1, fork, rng, palette, t - .04);
	if (rng() < fork && depth > 1) {
		const ang = Math.atan2(dy, dx) + (rng() - .5) * 1.4;
		const fl = dist * randRange(rng, .28, .55);
		lightning(ctx, mx, my, mx + Math.cos(ang) * fl, my + Math.sin(ang) * fl, jag * .6, depth - 2, fork * .6, rng, palette, t - .12);
	}
}
function drawBolt(ctx, w, h, s) {
	const rng = mulberry32(s.seed >>> 0);
	const fork = s.angle / 80;
	const bolts = 1 + extra(s) + (rng() < fork ? 1 : 0);
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	for (let b = 0; b < bolts; b++) {
		const x0 = w * (.22 + rng() * .56);
		const y0 = h * .04;
		const x1 = x0 + (rng() - .5) * w * .42 + sway(s.wind, s.time, b) * 90;
		const y1 = h * (.5 + s.length * .32);
		ctx.shadowColor = css(s.palette.celestialColor, .8);
		ctx.shadowBlur = 28;
		lightning(ctx, x0, y0, x1, y1, .16 + s.depth * .03 + rng() * .06, Math.max(3, Math.round(s.depth) + extra(s)), fork + extra(s) * .05, rng, s.palette, s.growth);
	}
	ctx.shadowBlur = 0;
}
function hypha(ctx, x, y, ang, len, depth, maxD, s, rng, t, groundY, floorY, width, fruit) {
	if (depth > maxD || t <= 0 || len < 3) return;
	const pulse = .4 + .5 * Math.sin(s.time * (.7 + s.wind) + depth + x * .01);
	let nextAng = ang + randRange(rng, -s.angle / 55, s.angle / 55);
	let x2 = x + Math.cos(nextAng) * len;
	let y2 = y + Math.sin(nextAng) * len;
	if (y2 < groundY + 6) {
		y2 = groundY + 6 + (groundY + 6 - y2) * .4;
		nextAng = Math.PI / 2 + randRange(rng, -1.1, 1.1);
		x2 = x + Math.cos(nextAng) * len;
		y2 = Math.max(groundY + 6, y + Math.sin(nextAng) * len);
		if (depth > 1 && rng() < .12) fruit.push({
			x,
			y: groundY
		});
	}
	if (y2 > floorY) {
		y2 = floorY - rng() * 8;
		nextAng = -Math.PI / 2 + randRange(rng, -1.2, 1.2);
	}
	if (x2 < 8) x2 = 8 + rng() * 6;
	if (x2 > width - 8) x2 = width - 8 - rng() * 6;
	ctx.strokeStyle = css(mix(s.palette.celestialColor, s.palette.leafA, .35 + depth / maxD * .4), .55 + t * .4 * pulse);
	ctx.lineWidth = Math.max(.9, 3.1 - depth * .24);
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.quadraticCurveTo((x + x2) / 2 + Math.sin(nextAng) * 4, (y + y2) / 2, x2, y2);
	ctx.stroke();
	if (depth >= maxD - 1 || rng() < .16) {
		ctx.fillStyle = css(s.palette.celestialColor, .22 + pulse * .45);
		ctx.beginPath();
		ctx.arc(x2, y2, 1.4 + rng() * 1.6, 0, Math.PI * 2);
		ctx.fill();
	}
	const forks = 1 + (rng() < s.angle / 65 ? 1 : 0) + (rng() < .22 ? 1 : 0);
	for (let i = 0; i < forks; i++) hypha(ctx, x2, y2, nextAng + randRange(rng, -s.angle / 48, s.angle / 48), len * randRange(rng, .58, .82), depth + 1, maxD, s, rng, t - .08, groundY, floorY, width, fruit);
}
function drawMushroom(ctx, x, groundY, s, bloom) {
	const size = (bloom ? 7 : 5) * s.length;
	const stemH = size * (bloom ? 2.1 : 1.5);
	ctx.strokeStyle = css(ink(s.palette), .85);
	ctx.lineWidth = Math.max(1.2, size * .28);
	ctx.beginPath();
	ctx.moveTo(x, groundY + 4);
	ctx.lineTo(x, groundY - stemH);
	ctx.stroke();
	ctx.fillStyle = css(wash(s.palette, bloom ? s.palette.blossom : s.palette.leafA), .9);
	ctx.beginPath();
	ctx.ellipse(x, groundY - stemH, size, size * .55, 0, Math.PI, Math.PI * 2);
	ctx.fill();
	if (bloom) {
		ctx.fillStyle = css(s.palette.blossomCenter, .7);
		ctx.beginPath();
		ctx.ellipse(x, groundY - stemH + 1, size * .45, size * .18, 0, 0, Math.PI * 2);
		ctx.fill();
	}
}
function drawMycelium(ctx, w, h, s) {
	const rng = mulberry32(s.seed >>> 0);
	const groundY = h * .4;
	const floorY = h * .96;
	const origins = 5 + extra(s) + Math.floor(rng() * 3);
	const maxD = Math.max(3, Math.round(s.depth) + extra(s));
	const fruit = [];
	for (let i = 0; i < origins; i++) {
		const x = w * (.08 + i / Math.max(1, origins - 1) * .84);
		const y = groundY + 18 + rng() * (h * .12);
		const shoots = 3 + Math.floor(rng() * 3);
		for (let k = 0; k < shoots; k++) hypha(ctx, x, y, randRange(rng, .15, Math.PI - .15), Math.min(w, h) * .055 * s.length, 0, maxD, s, rng, s.growth, groundY, floorY, w, fruit);
	}
	const showLeaf = s.overlay === "leaves" || s.overlay === "both";
	const showBloom = s.overlay === "blossoms" || s.overlay === "both";
	const nFruit = Math.min(fruit.length, 4 + extra(s) * 2);
	for (let i = 0; i < nFruit; i++) {
		if (s.growth < .55) break;
		if (showBloom) drawMushroom(ctx, fruit[i].x, groundY, s, true);
		else if (showLeaf) drawMushroom(ctx, fruit[i].x, groundY, s, false);
	}
}
function drawFeather(ctx, w, h, s) {
	const rng = mulberry32(s.seed >>> 0);
	const ox = w * .5;
	const oy = h * .9;
	const lean = (rng() - .5) * .3;
	const span = Math.min(w, h) * .72 * s.length;
	const barbs = Math.max(10, Math.round(s.depth) * 3 + extra(s) * 4);
	const shown = Math.max(2, Math.floor(barbs * s.growth));
	const ang0 = -Math.PI / 2 + lean;
	const tipX = ox + Math.cos(ang0) * span;
	const tipY = oy + Math.sin(ang0) * span;
	const flutter = s.wind;
	const showVane = s.overlay !== "bare";
	const showAfter = s.overlay === "blossoms" || s.overlay === "both";
	ctx.strokeStyle = css(ink(s.palette), .95);
	ctx.lineWidth = 3.2 * s.length;
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.moveTo(ox, oy);
	ctx.lineTo(tipX, tipY);
	ctx.stroke();
	const spread = s.angle * Math.PI / 180;
	for (let i = 1; i <= shown; i++) {
		const t = i / (barbs + 1);
		const bx = ox + (tipX - ox) * t;
		const by = oy + (tipY - oy) * t;
		const side = i % 2 === 0 ? 1 : -1;
		const wave = Math.sin(s.time * 1.2 + i * .35) * flutter * .18;
		const barbAng = ang0 + side * (spread * (.55 + t * .5) + wave);
		const barbLen = span * .38 * (1 - t * .55) * s.length;
		const ex = bx + Math.cos(barbAng) * barbLen;
		const ey = by + Math.sin(barbAng) * barbLen;
		ctx.strokeStyle = css(wash(s.palette, mix(s.palette.leafA, s.palette.leafB, t)), .85);
		ctx.lineWidth = Math.max(.7, 2.1 * (1 - t));
		ctx.beginPath();
		ctx.moveTo(bx, by);
		ctx.quadraticCurveTo(bx + Math.cos(barbAng - side * .25) * barbLen * .45, by + Math.sin(barbAng - side * .25) * barbLen * .45, ex, ey);
		ctx.stroke();
		if (showVane && i % 2 === 0) {
			const sub = 3 + extra(s);
			for (let k = 1; k <= sub; k++) {
				const u = k / (sub + 1);
				const sx = bx + (ex - bx) * u;
				const sy = by + (ey - by) * u;
				const sl = barbLen * .18 * (1 - u);
				ctx.strokeStyle = css(wash(s.palette, s.palette.leafB), .45);
				ctx.lineWidth = .6;
				ctx.beginPath();
				ctx.moveTo(sx, sy);
				ctx.lineTo(sx + Math.cos(barbAng + side * .7) * sl, sy + Math.sin(barbAng + side * .7) * sl);
				ctx.stroke();
			}
		}
		if (showAfter && i % 5 === 0) {
			ctx.fillStyle = css(wash(s.palette, s.palette.blossom), .7);
			ctx.beginPath();
			ctx.arc(ex, ey, 2, 0, Math.PI * 2);
			ctx.fill();
		}
	}
}
function drawFlame(ctx, w, h, s) {
	const rng = mulberry32(s.seed >>> 0);
	const spread = s.angle * Math.PI / 180;
	const maxD = Math.max(3, Math.round(s.depth) + extra(s));
	const tongues = 3 + extra(s) + (rng() < .4 ? 1 : 0);
	ctx.lineCap = "round";
	ctx.globalCompositeOperation = "lighter";
	function tongue(x, y, ang, len, width, depth, t) {
		if (depth > maxD || t <= 0 || len < 4) return;
		const flick = Math.sin(s.time * (6 + s.wind * 8) + depth * 1.7 + x * .02) * s.wind * .35;
		const x2 = x + Math.cos(ang + flick) * len;
		const y2 = y + Math.sin(ang + flick) * len;
		const heat = depth / maxD;
		ctx.strokeStyle = css(mix(s.palette.bark, mix(s.palette.blossom, s.palette.celestialColor, heat), .35 + heat * .65), .35 + t * .5);
		ctx.lineWidth = Math.max(.8, width);
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.quadraticCurveTo((x + x2) / 2 + Math.sin(ang) * len * .15, (y + y2) / 2, x2, y2);
		ctx.stroke();
		const split = 1 + (rng() < .55 ? 1 : 0);
		for (let i = 0; i < split; i++) tongue(x2, y2, ang + randRange(rng, -spread, spread), len * randRange(rng, .62, .82), Math.max(.8, width * .7), depth + 1, t - .08);
	}
	for (let i = 0; i < tongues; i++) tongue(w * (.38 + (tongues === 1 ? .5 : i / (tongues - 1)) * .24), h * .9, -Math.PI / 2 + randRange(rng, -.2, .2), Math.min(w, h) * .11 * s.length, 10 * s.length, 0, s.growth);
	ctx.globalCompositeOperation = "source-over";
}
function drawDelta(ctx, w, h, s) {
	const rng = mulberry32(s.seed >>> 0);
	const splay = s.angle * Math.PI / 180;
	const maxD = Math.max(3, Math.round(s.depth) + extra(s));
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	function channel(x, y, ang, len, width, depth, t) {
		if (depth > maxD || t <= 0 || len < 5) return;
		const drift = sway(s.wind, s.time, depth + x * .01) * .5;
		const x2 = x + Math.cos(ang + drift) * len;
		const y2 = y + Math.sin(ang + drift) * len;
		ctx.strokeStyle = css(wash(s.palette, mix(s.palette.leafA, s.palette.celestialColor, depth / maxD)), .55 + t * .4);
		ctx.lineWidth = Math.max(1.1, width);
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.quadraticCurveTo((x + x2) / 2 + Math.sin(ang) * 6, (y + y2) / 2, x2, y2);
		ctx.stroke();
		const forks = 2 + (rng() < .28 ? 1 : 0);
		for (let i = 0; i < forks; i++) {
			const u = forks === 1 ? 0 : i / (forks - 1);
			channel(x2, y2, ang - splay + u * 2 * splay + randRange(rng, -.12, .12), len * randRange(rng, .62, .82), Math.max(1.1, width * .68), depth + 1, t - .09);
		}
	}
	channel(w * (.42 + rng() * .16), h * .16, Math.PI / 2 + randRange(rng, -.12, .12), Math.min(w, h) * .12 * s.length, 11 * s.length, 0, s.growth);
}
function hexagon(ctx, x, y, r, rot) {
	ctx.beginPath();
	for (let i = 0; i < 6; i++) {
		const a = rot + i * Math.PI / 3;
		const px = x + Math.cos(a) * r;
		const py = y + Math.sin(a) * r;
		if (i === 0) ctx.moveTo(px, py);
		else ctx.lineTo(px, py);
	}
	ctx.closePath();
}
function drawCrystal(ctx, w, h, s) {
	const rng = mulberry32(s.seed >>> 0);
	const facets = Math.max(4, Math.round(s.angle));
	const order = Math.max(2, Math.round(s.depth) + extra(s));
	const ox = w * .5;
	const oy = h * .82;
	function cluster(x, y, r, rot, depth, t) {
		if (depth > order || t <= 0 || r < 4) return;
		ctx.fillStyle = css(wash(s.palette, mix(s.palette.celestialColor, s.palette.leafA, depth / (order + 1))), .18 + t * .28);
		ctx.strokeStyle = css(ink(s.palette), .55 + t * .35);
		ctx.lineWidth = Math.max(.6, 2.2 - depth * .25);
		hexagon(ctx, x, y, r, rot);
		ctx.fill();
		ctx.stroke();
		const n = depth === 0 ? facets : 2 + (rng() < .5 ? 1 : 0);
		for (let i = 0; i < n; i++) {
			const a = rot + i / n * Math.PI * 2 + randRange(rng, -.15, .15);
			cluster(x + Math.cos(a) * r * .95, y + Math.sin(a) * r * .72 - r * .15, r * randRange(rng, .42, .58), a, depth + 1, t - .1);
		}
	}
	cluster(ox, oy, Math.min(w, h) * .11 * s.length, rng() * .4, 0, s.growth);
}
function drawShell(ctx, w, h, s) {
	const rng = mulberry32(s.seed >>> 0);
	const b = Math.max(.12, s.angle);
	const chambers = Math.max(8, Math.round(s.depth) + extra(s) * 2);
	const shown = Math.max(3, Math.floor(chambers * Math.max(.15, s.growth)));
	const ox = w * .5;
	const oy = h * .6;
	const a0 = Math.min(w, h) * .007 * s.length;
	const spin = rng() * .6 + sway(s.wind, s.time, .3) * .12;
	const pts = [];
	for (let i = 0; i <= shown; i++) {
		const th = spin + i * .38;
		const r = a0 * Math.exp(b * i * 1.15);
		pts.push({
			x: ox + Math.cos(th) * r,
			y: oy + Math.sin(th) * r * .9,
			r,
			th
		});
	}
	const nacre = wash(s.palette, mix(s.palette.blossom, s.palette.leafB, .35));
	ctx.beginPath();
	ctx.moveTo(pts[0].x, pts[0].y);
	for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
	for (let i = pts.length - 1; i >= 0; i--) {
		const p = pts[i];
		ctx.lineTo(ox + Math.cos(p.th) * p.r * .18, oy + Math.sin(p.th) * p.r * .16);
	}
	ctx.closePath();
	ctx.fillStyle = css(nacre, .42);
	ctx.fill();
	ctx.strokeStyle = css(ink(s.palette), .9);
	ctx.lineWidth = 1.8 * s.length;
	ctx.stroke();
	ctx.strokeStyle = css(ink(s.palette), .4);
	ctx.lineWidth = .9;
	for (let i = 2; i < pts.length; i += 1) {
		const p = pts[i];
		ctx.beginPath();
		ctx.moveTo(ox + Math.cos(p.th) * p.r * .2, oy + Math.sin(p.th) * p.r * .18);
		ctx.lineTo(p.x, p.y);
		ctx.stroke();
	}
}
function easeOutCubic(t) {
	return 1 - (1 - Math.max(0, Math.min(1, t))) ** 3;
}
function branchGrowth(b, wave) {
	return easeOutCubic((wave - b.startT) / b.duration);
}
function layout(grove, wave, wind, time, ox, oy, scale) {
	const nodes = new Array(grove.branches.length);
	const depthNorm = 1 / Math.max(1, grove.maxDepth);
	for (let i = 0; i < grove.branches.length; i++) {
		const b = grove.branches[i];
		const g = branchGrowth(b, wave);
		let x;
		let y;
		let base;
		if (b.parent < 0) {
			x = ox;
			y = oy;
			base = b.angle;
		} else {
			const p = nodes[b.parent];
			if (!p) {
				x = ox;
				y = oy;
				base = b.angle;
			} else {
				x = p.x + Math.cos(p.angle) * p.drawn;
				y = p.y + Math.sin(p.angle) * p.drawn;
				base = p.angle + b.angle;
			}
		}
		const tip = (b.depth * depthNorm) ** 1.35;
		const sway = Math.sin(time * .72 + b.windPhase) * wind * .26 * (.18 + tip) * b.windAmp;
		const gust = Math.sin(time * .33 + b.windPhase * 1.7) * wind * .09 * tip;
		const angle = base + (sway + gust) * g;
		nodes[i] = {
			x,
			y,
			angle,
			drawn: b.length * scale * g,
			growth: g
		};
	}
	return nodes;
}
function pointOnQuadratic(x0, y0, cx, cy, x1, y1, t) {
	const mt = 1 - t;
	return {
		x: mt * mt * x0 + 2 * mt * t * cx + t * t * x1,
		y: mt * mt * y0 + 2 * mt * t * cy + t * t * y1
	};
}
function tangentOnQuadratic(x0, y0, cx, cy, x1, y1, t) {
	const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx);
	const dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy);
	return Math.atan2(dy, dx);
}
function fillSky(ctx, w, h, p) {
	const g = ctx.createLinearGradient(0, 0, 0, h);
	g.addColorStop(0, css(p.skyTop));
	g.addColorStop(.55, css(mix(p.skyTop, p.skyBottom, .55)));
	g.addColorStop(1, css(p.skyBottom));
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, h);
	const haze = ctx.createRadialGradient(w * .5, h * .42, 20, w * .5, h * .55, w * .72);
	haze.addColorStop(0, css(p.haze, .22));
	haze.addColorStop(1, css(p.haze, 0));
	ctx.fillStyle = haze;
	ctx.fillRect(0, 0, w, h);
}
function drawCelestial(ctx, w, h, p) {
	if (p.celestial === "none") return;
	const cx = w * (p.celestial === "sun" ? .78 : .74);
	const cy = h * (p.celestial === "sun" ? .78 : .18);
	const r = p.celestial === "sun" ? Math.min(w, h) * .16 : Math.min(w, h) * .07;
	const glow = ctx.createRadialGradient(cx, cy, r * .2, cx, cy, r * 4.2);
	glow.addColorStop(0, css(p.celestialColor, p.celestial === "sun" ? .35 : .2));
	glow.addColorStop(1, css(p.celestialColor, 0));
	ctx.fillStyle = glow;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 4.2, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = css(p.celestialColor, p.celestial === "sun" ? .95 : .88);
	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, Math.PI * 2);
	ctx.fill();
	if (p.celestial === "moon") {
		ctx.fillStyle = css(p.skyTop, .55);
		ctx.beginPath();
		ctx.arc(cx + r * .38, cy - r * .18, r * .82, 0, Math.PI * 2);
		ctx.fill();
	}
}
function drawSoilCutaway(ctx, w, h, p) {
	const gy = h * .4;
	ctx.fillStyle = css(recede(p, p.hillFar, .35), .85);
	ctx.beginPath();
	ctx.moveTo(0, gy);
	ctx.lineTo(0, gy - h * .12);
	ctx.quadraticCurveTo(w * .3, gy - h * .2, w * .62, gy - h * .1);
	ctx.quadraticCurveTo(w * .85, gy - h * .04, w, gy - h * .14);
	ctx.lineTo(w, gy);
	ctx.closePath();
	ctx.fill();
	const soil = ctx.createLinearGradient(0, gy, 0, h);
	soil.addColorStop(0, css(mix(p.ground, p.bark, .18)));
	soil.addColorStop(.35, css(mix(p.ground, p.bark, .45)));
	soil.addColorStop(1, css(mix(p.bark, [
		12,
		8,
		6
	], .35)));
	ctx.fillStyle = soil;
	ctx.fillRect(0, gy, w, h - gy);
	for (let i = 1; i <= 4; i++) {
		const y = gy + (h - gy) * i / 5;
		ctx.strokeStyle = css(p.bark, .08);
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.quadraticCurveTo(w * .5, y + (i % 2 === 0 ? 6 : -5), w, y);
		ctx.stroke();
	}
	ctx.fillStyle = css(p.hillNear);
	ctx.beginPath();
	ctx.moveTo(0, gy + 7);
	ctx.quadraticCurveTo(w * .35, gy - 10, w * .7, gy + 4);
	ctx.quadraticCurveTo(w * .88, gy + 10, w, gy - 2);
	ctx.lineTo(w, gy + 14);
	ctx.lineTo(0, gy + 14);
	ctx.closePath();
	ctx.fill();
	const lip = ctx.createLinearGradient(0, gy - 2, 0, gy + 18);
	lip.addColorStop(0, css(p.ground, 0));
	lip.addColorStop(.45, css(p.ground, .7));
	lip.addColorStop(1, css(mix(p.ground, p.bark, .3), .9));
	ctx.fillStyle = lip;
	ctx.fillRect(0, gy - 2, w, 22);
}
function drawHills(ctx, w, h, p) {
	ctx.fillStyle = css(recede(p, p.hillFar, .28), .92);
	ctx.beginPath();
	ctx.moveTo(0, h);
	ctx.lineTo(0, h * .72);
	ctx.quadraticCurveTo(w * .22, h * .62, w * .48, h * .7);
	ctx.quadraticCurveTo(w * .72, h * .78, w, h * .66);
	ctx.lineTo(w, h);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = css(recede(p, p.hillNear, .12));
	ctx.beginPath();
	ctx.moveTo(0, h);
	ctx.lineTo(0, h * .84);
	ctx.quadraticCurveTo(w * .3, h * .76, w * .58, h * .86);
	ctx.quadraticCurveTo(w * .8, h * .92, w, h * .8);
	ctx.lineTo(w, h);
	ctx.closePath();
	ctx.fill();
	const ground = ctx.createLinearGradient(0, h * .86, 0, h);
	ground.addColorStop(0, css(p.ground, 0));
	ground.addColorStop(.35, css(p.ground, .85));
	ground.addColorStop(1, css(p.ground));
	ctx.fillStyle = ground;
	ctx.fillRect(0, h * .86, w, h * .14);
}
function drawParticles(ctx, w, h, p, time, seed) {
	if (p.particleCount <= 0) return;
	const rng = mulberry32((seed ^ 2654435769) >>> 0);
	ctx.save();
	for (let i = 0; i < p.particleCount; i++) {
		const px = rng();
		const py = rng() * .78;
		const r = .6 + rng() * 1.6;
		const phase = rng() * Math.PI * 2;
		const speed = .04 + rng() * .08;
		const bob = Math.sin(time * speed + phase);
		const x = ((time * (.008 + rng() * .012) + px) % 1 + 1) % 1 * w;
		const y = py * h + bob * 10;
		const a = .18 + (.35 + rng() * .25) * (.5 + .5 * Math.sin(time * .7 + phase));
		ctx.fillStyle = css(p.particle, a);
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}
function controlPoint(node, b) {
	const ex = node.x + Math.cos(node.angle) * node.drawn;
	const ey = node.y + Math.sin(node.angle) * node.drawn;
	const nx = -Math.sin(node.angle);
	const ny = Math.cos(node.angle);
	const mag = b.curve * node.drawn;
	return {
		ex,
		ey,
		cx: (node.x + ex) / 2 + nx * mag,
		cy: (node.y + ey) / 2 + ny * mag
	};
}
function drawBranches(ctx, grove, nodes, palette) {
	for (let i = 0; i < grove.branches.length; i++) {
		const b = grove.branches[i];
		const n = nodes[i];
		if (n.growth <= .001) continue;
		const { ex, ey, cx, cy } = controlPoint(n, b);
		const t = b.depth / Math.max(1, grove.maxDepth);
		ctx.strokeStyle = css(mix(ink(palette), wash(palette, palette.barkTip), t));
		ctx.lineWidth = Math.max(.65, b.width * Math.max(.25, n.growth));
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.beginPath();
		ctx.moveTo(n.x, n.y);
		ctx.quadraticCurveTo(cx, cy, ex, ey);
		ctx.stroke();
	}
}
function drawLeaf(ctx, x, y, angle, size, color, alpha) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(angle);
	ctx.globalAlpha = alpha;
	ctx.fillStyle = css(color);
	ctx.beginPath();
	ctx.ellipse(size * .55, 0, size, size * .38, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}
function drawBlossom(ctx, x, y, size, spin, petals, petal, center, alpha) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(spin);
	ctx.globalAlpha = alpha;
	for (let i = 0; i < petals; i++) {
		const a = i / petals * Math.PI * 2;
		ctx.fillStyle = css(petal);
		ctx.beginPath();
		ctx.ellipse(Math.cos(a) * size * .42, Math.sin(a) * size * .42, size * .42, size * .24, a, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.fillStyle = css(center);
	ctx.beginPath();
	ctx.arc(0, 0, size * .2, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}
function drawFoliage(ctx, grove, nodes, palette, overlay, time, want) {
	const showLeaves = overlay === "leaves" || overlay === "both";
	const showBlossoms = overlay === "blossoms" || overlay === "both";
	if (want === "leaf" && !showLeaves) return;
	if (want === "blossom" && !showBlossoms) return;
	for (let i = 0; i < grove.branches.length; i++) {
		const b = grove.branches[i];
		const n = nodes[i];
		if (n.growth < .55) continue;
		const { ex, ey, cx, cy } = controlPoint(n, b);
		for (const f of b.foliage) {
			if (f.kind !== want) continue;
			const appear = Math.max(0, Math.min(1, (n.growth - .62) / .38));
			if (appear <= 0) continue;
			const pt = pointOnQuadratic(n.x, n.y, cx, cy, ex, ey, f.t);
			const tan = tangentOnQuadratic(n.x, n.y, cx, cy, ex, ey, f.t);
			const breathe = 1 + Math.sin(time * 1.1 + f.spin) * .04;
			const size = f.size * appear * breathe;
			if (f.kind === "leaf") {
				const color = wash(palette, mix(palette.leafA, palette.leafB, f.colorT));
				drawLeaf(ctx, pt.x, pt.y, tan + f.tilt + f.side * .35, size, color, .55 + appear * .4);
			} else {
				const petal = wash(palette, mix(palette.blossom, palette.blossomAlt, f.colorT));
				drawBlossom(ctx, pt.x, pt.y, size, f.spin + tan * .2, f.petals, petal, palette.blossomCenter, .65 + appear * .35);
			}
		}
	}
}
function drawPlate(ctx, p, cx, cy, r) {
	const g = ctx.createRadialGradient(cx, cy, r * .08, cx, cy, r);
	g.addColorStop(0, css(mix(p.haze, p.celestialColor, .25), .2));
	g.addColorStop(.55, css(p.haze, .08));
	g.addColorStop(1, css(p.haze, 0));
	ctx.fillStyle = g;
	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, Math.PI * 2);
	ctx.fill();
}
function drawContact(ctx, ox, oy, p, scale) {
	ctx.fillStyle = css(p.ground, .35);
	ctx.beginPath();
	ctx.ellipse(ox, oy + 4, 28 * scale, 6 * scale, 0, 0, Math.PI * 2);
	ctx.fill();
}
function drawRootFlare(ctx, ox, oy, palette, growth, width) {
	if (growth < .05) return;
	ctx.fillStyle = css(ink(palette), .95);
	ctx.beginPath();
	ctx.moveTo(ox - width * 1.15, oy + 6);
	ctx.quadraticCurveTo(ox, oy - width * .2, ox + width * 1.15, oy + 6);
	ctx.quadraticCurveTo(ox, oy + 14, ox - width * 1.15, oy + 6);
	ctx.fill();
}
function drawVignette(ctx, w, h, p) {
	const g = ctx.createRadialGradient(w * .5, h * .48, Math.min(w, h) * .25, w * .5, h * .5, Math.max(w, h) * .72);
	g.addColorStop(0, css(p.vignette, 0));
	g.addColorStop(1, css(p.vignette, .38));
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, h);
}
function drawGrove(ctx, width, height, state, seed, length) {
	const w = Math.max(1, width);
	const h = Math.max(1, height);
	const kind = getKind(state.kind);
	const emerged = emergeParams(state.kind, state.angle, state.depth, state.length, state.wind);
	const mapped = {
		...state,
		...emerged,
		length: emerged.length
	};
	fillSky(ctx, w, h, mapped.palette);
	drawCelestial(ctx, w, h, mapped.palette);
	if (kind.cutaway) drawSoilCutaway(ctx, w, h, mapped.palette);
	else if (kind.landscape) drawHills(ctx, w, h, mapped.palette);
	const time = mapped.reducedMotion ? 0 : mapped.time;
	const wind = mapped.reducedMotion ? 0 : emerged.wind;
	const live = {
		...mapped,
		time,
		wind,
		length: emerged.length,
		seed
	};
	const plateR = Math.min(w, h) * .42 * Math.max(.7, emerged.length);
	if (state.kind === "frost") drawPlate(ctx, mapped.palette, w * .5, h * .48, plateR);
	else if (kind.cutaway) drawPlate(ctx, mapped.palette, w * .5, h * .68, plateR * .9);
	else if (kind.landscape) drawPlate(ctx, mapped.palette, w * .5, h * .58, plateR);
	switch (state.kind) {
		case "frost":
			drawFrost(ctx, w, h, live);
			break;
		case "bolt":
			drawBolt(ctx, w, h, live);
			break;
		case "flame":
			drawFlame(ctx, w, h, live);
			break;
		case "delta":
			drawDelta(ctx, w, h, live);
			break;
		case "crystal":
			drawCrystal(ctx, w, h, live);
			break;
		case "shell":
			drawShell(ctx, w, h, live);
			break;
		case "mycelium":
			drawMycelium(ctx, w, h, live);
			break;
		case "feather":
			drawFeather(ctx, w, h, live);
			break;
		default: {
			const grove = state.grove;
			if (grove) {
				const ox = w * .5;
				const oy = h * .88;
				const scale = Math.min(w, h) * (.2 * Math.max(.2, emerged.length)) / Math.max(1, grove.trunkLength);
				const wave = state.growth * (grove.maxEnd + .04);
				const nodes = layout(grove, wave, wind, time, ox, oy, scale);
				drawContact(ctx, ox, oy, mapped.palette, Math.max(.4, emerged.length));
				const trunk = grove.branches[0];
				if (trunk) drawRootFlare(ctx, ox, oy, mapped.palette, branchGrowth(trunk, wave), trunk.width);
				drawBranches(ctx, grove, nodes, mapped.palette);
				drawFoliage(ctx, grove, nodes, mapped.palette, state.overlay, time, "leaf");
				drawFoliage(ctx, grove, nodes, mapped.palette, state.overlay, time, "blossom");
			}
		}
	}
	if (state.kind !== "frost") drawParticles(ctx, w, h, mapped.palette, time, seed);
	drawVignette(ctx, w, h, mapped.palette);
}
function growthDurationMs(depth, reduced, expand = false) {
	if (reduced) return 0;
	if (expand) return 1200 + depth * 70;
	return 2400 + depth * 140;
}
function pushFoliage(list, rng, kind, t) {
	list.push({
		t,
		side: rng() < .5 ? 1 : -1,
		size: kind === "blossom" ? randRange(rng, 4.6, 8) : randRange(rng, 8, 15),
		tilt: randRange(rng, -.55, .55),
		colorT: rng(),
		kind,
		petals: rng() < .2 ? 4 : 5,
		spin: rng() * Math.PI * 2
	});
}
function generateGrove(params) {
	const extra = Math.max(0, Math.round(params.expansion ?? 0));
	const willow = params.form === "willow";
	const pine = params.form === "pine";
	const rng = mulberry32(params.seed >>> 0);
	const branches = [];
	const maxDepth = Math.min(pine ? 11 : willow ? 12 : 13, Math.round(params.depth) + extra);
	const spread = willow ? .36 + rng() * .14 : params.angle * Math.PI / 180 * (pine ? .72 : 1);
	const weep = willow ? params.angle * Math.PI / 180 : 0;
	function addBranch(parent, length, width, angle, depth) {
		const i = branches.length;
		const parentBranch = parent < 0 ? null : branches[parent];
		const startT = parentBranch ? parentBranch.startT + parentBranch.duration * .58 : 0;
		const duration = .09 + .055 * (1 - depth / Math.max(1, maxDepth));
		const foliage = [];
		const nearTip = depth >= maxDepth - 1 || length < 14;
		const midCanopy = depth >= Math.max(2, maxDepth - 4);
		if (nearTip) {
			pushFoliage(foliage, rng, "leaf", 1);
			if (rng() < (willow ? .4 : .72)) pushFoliage(foliage, rng, "blossom", 1);
			if (rng() < .35) pushFoliage(foliage, rng, "leaf", .82);
		} else if (midCanopy && rng() < (willow ? .7 : .58)) {
			const count = 1 + Math.floor(rng() * (willow ? 3 : 2));
			for (let n = 0; n < count; n++) pushFoliage(foliage, rng, rng() < .18 ? "blossom" : "leaf", randRange(rng, .45, .95));
		}
		branches.push({
			parent,
			length,
			width,
			angle,
			depth,
			curve: randRange(rng, willow ? .05 : -.22, willow ? .42 : .22),
			windPhase: rng() * Math.PI * 2,
			windAmp: randRange(rng, .45, 1),
			startT,
			duration,
			foliage
		});
		if (depth >= maxDepth || length < 9) return i;
		const childWidth = Math.max(.7, width * randRange(rng, willow ? .55 : .62, willow ? .68 : .72));
		const shrink = randRange(rng, willow ? .7 : .66, willow ? .86 : .78);
		const jitter = () => randRange(rng, -.14, .14);
		const split = spread * randRange(rng, .82, 1.18);
		const droop = weep * (.25 + depth / Math.max(1, maxDepth));
		const ternary = !willow && !pine && depth > 1 && depth < maxDepth - 1 && rng() < .08 + extra * .07;
		if (pine && depth < maxDepth) {
			const count = depth === 0 ? 2 : 3 + (rng() < .4 ? 1 : 0);
			for (let k = 0; k < count; k++) {
				const t = count === 1 ? .5 : k / (count - 1);
				addBranch(i, length * shrink * randRange(rng, .7, .88), childWidth, -split + t * 2 * split + jitter(), depth + 1);
			}
			if (depth >= maxDepth - 2) for (let n = 0; n < 4; n++) addBranch(i, length * randRange(rng, .16, .28), childWidth * .4, randRange(rng, -1.05, 1.05), maxDepth);
		} else if (ternary) {
			addBranch(i, length * shrink * randRange(rng, .92, 1.05), childWidth, -split + jitter(), depth + 1);
			addBranch(i, length * shrink * randRange(rng, .78, .95), childWidth * .9, jitter() * .4, depth + 1);
			addBranch(i, length * shrink * randRange(rng, .92, 1.05), childWidth, split + jitter(), depth + 1);
		} else {
			addBranch(i, length * shrink * randRange(rng, .9, 1.08), childWidth, -split * randRange(rng, .78, 1.12) - droop + jitter(), depth + 1);
			addBranch(i, length * shrink * randRange(rng, .9, 1.08), childWidth, split * randRange(rng, .78, 1.12) + droop + jitter(), depth + 1);
		}
		if (depth > 1 && depth < maxDepth - 1 && rng() < (willow ? .42 : .22) + extra * .08) {
			const dir = rng() < .5 ? -1 : 1;
			addBranch(i, length * randRange(rng, willow ? .34 : .28, willow ? .58 : .44), childWidth * .7, dir * randRange(rng, .7, 1.25) + dir * droop, maxDepth);
		}
		return i;
	}
	const trunkLen = pine ? 158 : willow ? 132 : 150;
	const trunkWidth = randRange(rng, pine ? 11 : willow ? 10 : 12, pine ? 16 : willow ? 16 : 19);
	const lean = randRange(rng, willow ? -.12 : -.2, willow ? .12 : .2);
	addBranch(-1, trunkLen, trunkWidth, -Math.PI / 2 + lean, 0);
	if (!willow && !pine && rng() < .16 + extra * .04) addBranch(-1, trunkLen * randRange(rng, .55, .78), trunkWidth * .62, -Math.PI / 2 + randRange(rng, -.55, .55), 1);
	let maxEnd = 0;
	for (const b of branches) maxEnd = Math.max(maxEnd, b.startT + b.duration);
	return {
		branches,
		maxEnd,
		maxDepth,
		trunkLength: trunkLen
	};
}
function prefersReducedMotion() {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function treeForm(kind) {
	return kind === "grove" ? "grove" : null;
}
function GroveCanvas() {
	const canvasRef = (0, import_react.useRef)(null);
	const seed = useGroveStore((s) => s.seed);
	const kind = useGroveStore((s) => s.kind);
	const angle = useGroveStore((s) => s.angle);
	const depth = useGroveStore((s) => s.depth);
	const length = useGroveStore((s) => s.length);
	const wind = useGroveStore((s) => s.wind);
	const overlay = useGroveStore((s) => s.overlay);
	const paletteId = useGroveStore((s) => s.paletteId);
	const generation = useGroveStore((s) => s.generation);
	const expansion = useGroveStore((s) => s.expansion);
	const groveRef = (0, import_react.useRef)(null);
	const growthRef = (0, import_react.useRef)(0);
	const growFromRef = (0, import_react.useRef)(0);
	const growUntilRef = (0, import_react.useRef)(0);
	const growStartRef = (0, import_react.useRef)(0);
	const replayRef = (0, import_react.useRef)(true);
	const paramsRef = (0, import_react.useRef)({
		overlay,
		wind,
		paletteId,
		length,
		seed,
		kind,
		angle,
		depth,
		expansion
	});
	const timeRef = (0, import_react.useRef)(0);
	const zoomRef = (0, import_react.useRef)(1);
	const focusRef = (0, import_react.useRef)({
		x: .5,
		y: .58
	});
	(0, import_react.useEffect)(() => {
		const form = treeForm(kind);
		if (form) {
			const emerged = emergeParams(kind, angle, depth, length, wind);
			groveRef.current = generateGrove({
				seed,
				angle: emerged.angle,
				depth: emerged.depth,
				expansion,
				form
			});
		} else groveRef.current = null;
	}, [
		seed,
		angle,
		depth,
		length,
		wind,
		kind,
		expansion
	]);
	(0, import_react.useEffect)(() => {
		paramsRef.current = {
			overlay,
			wind,
			paletteId,
			length,
			seed,
			kind,
			angle,
			depth,
			expansion
		};
	}, [
		overlay,
		wind,
		paletteId,
		length,
		seed,
		kind,
		angle,
		depth,
		expansion
	]);
	(0, import_react.useEffect)(() => {
		replayRef.current = true;
		growStartRef.current = useGroveStore.getState().expandPulse ? .5 : 0;
		growthRef.current = growStartRef.current;
		zoomRef.current = 1;
		focusRef.current = {
			x: .5,
			y: .58
		};
	}, [
		generation,
		seed,
		kind
	]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let frame = 0;
		let last = performance.now();
		let reduced = prefersReducedMotion();
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const onMotion = () => {
			reduced = media.matches;
		};
		media.addEventListener("change", onMotion);
		const resize = () => {
			const parent = canvas.parentElement;
			if (!parent) return;
			const w = Math.max(1, parent.clientWidth);
			const h = Math.max(1, parent.clientHeight);
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.max(1, Math.floor(w * dpr));
			canvas.height = Math.max(1, Math.floor(h * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(canvas.parentElement ?? canvas);
		window.addEventListener("resize", resize);
		const loop = (now) => {
			const dt = Math.min(.1, (now - last) / 1e3);
			last = now;
			timeRef.current += dt;
			const p = paramsRef.current;
			if (treeForm(p.kind) && !groveRef.current) {
				const emerged = emergeParams(p.kind, p.angle, p.depth, p.length, p.wind);
				groveRef.current = generateGrove({
					seed: p.seed,
					angle: emerged.angle,
					depth: emerged.depth,
					expansion: p.expansion,
					form: treeForm(p.kind) ?? "grove"
				});
			}
			if (replayRef.current) {
				replayRef.current = false;
				const pulse = useGroveStore.getState().expandPulse;
				growFromRef.current = now;
				growUntilRef.current = now + growthDurationMs(useGroveStore.getState().depth, reduced, pulse);
				growthRef.current = reduced ? 1 : growStartRef.current;
			}
			const span = Math.max(1, growUntilRef.current - growFromRef.current);
			if (now < growUntilRef.current) {
				const eased = 1 - (1 - (now - growFromRef.current) / span) ** 3;
				const start = growStartRef.current;
				growthRef.current = start + (1 - start) * eased;
			} else growthRef.current = 1;
			const cssW = Math.max(1, canvas.parentElement?.clientWidth || canvas.clientWidth || 1);
			const cssH = Math.max(1, canvas.parentElement?.clientHeight || canvas.clientHeight || 1);
			try {
				const zoom = zoomRef.current;
				const focus = focusRef.current;
				const palette = getPalette(p.paletteId);
				ctx.fillStyle = css(palette.skyBottom);
				ctx.fillRect(0, 0, cssW, cssH);
				ctx.save();
				ctx.translate(cssW * focus.x, cssH * focus.y);
				ctx.scale(zoom, zoom);
				ctx.translate(-cssW * focus.x, -cssH * focus.y);
				drawGrove(ctx, cssW, cssH, {
					grove: groveRef.current,
					kind: p.kind,
					palette,
					overlay: p.overlay,
					wind: p.wind,
					time: timeRef.current,
					growth: growthRef.current,
					reducedMotion: reduced,
					length: p.length,
					seed: p.seed,
					angle: p.angle,
					depth: p.depth,
					expansion: p.expansion
				}, p.seed, p.length);
				ctx.restore();
			} catch {}
			frame = requestAnimationFrame(loop);
		};
		const onWheel = (e) => {
			e.preventDefault();
			const parent = canvas.parentElement;
			if (!parent) return;
			const rect = parent.getBoundingClientRect();
			const x = (e.clientX - rect.left) / Math.max(1, rect.width);
			const y = (e.clientY - rect.top) / Math.max(1, rect.height);
			const old = zoomRef.current;
			const next = Math.max(.55, Math.min(3.2, old * (e.deltaY < 0 ? 1.08 : .93)));
			const f = focusRef.current;
			f.x = f.x + (x - f.x) * (1 - old / next);
			f.y = f.y + (y - f.y) * (1 - old / next);
			zoomRef.current = next;
		};
		const onDbl = () => {
			zoomRef.current = 1;
			focusRef.current = {
				x: .5,
				y: .58
			};
		};
		canvas.addEventListener("wheel", onWheel, { passive: false });
		canvas.addEventListener("dblclick", onDbl);
		frame = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(frame);
			ro.disconnect();
			window.removeEventListener("resize", resize);
			media.removeEventListener("change", onMotion);
			canvas.removeEventListener("wheel", onWheel);
			canvas.removeEventListener("dblclick", onDbl);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		className: "grove-canvas",
		"aria-hidden": "true"
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-smooth-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-fg text-bg hover:opacity-90",
			accent: "bg-accent text-accent-fg hover:opacity-90",
			outline: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:bg-surface-2",
			ghost: "bg-transparent text-fg hover:bg-surface-2"
		},
		size: {
			default: "h-11 rounded-md px-4 text-sm",
			sm: "h-9 rounded-sm px-3 text-sm",
			lg: "h-12 rounded-md px-5 text-sm",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function GroveApp() {
	const seed = useGroveStore((s) => s.seed);
	const kind = useGroveStore((s) => s.kind);
	const expansion = useGroveStore((s) => s.expansion);
	const depth = useGroveStore((s) => s.depth);
	const length = useGroveStore((s) => s.length);
	const meta = getKind(kind);
	const cap = growthCap(kind, depth, length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grove-shell bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "grove-chrome flex flex-col gap-3 p-3 md:flex-row md:items-start md:justify-between md:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display italic text-2xl leading-none tracking-tight text-fg md:text-3xl",
						children: "Sylva"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs tracking-wide text-muted",
						children: [meta.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono tabular-nums text-subtle",
							children: [
								" ",
								"· № ",
								seed,
								expansion > 0 ? ` · grown ${expansion}/${cap}` : ""
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 md:flex md:shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						className: "min-h-11 w-full md:w-auto",
						"data-grove-action": "grow",
						"aria-label": "Expand further",
						title: expansion >= cap ? "Fully grown from this start" : "Let it put out more",
						onPointerUp: handleGrovePointer,
						onClick: handleGrovePointer,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Expand, {}), "Grow"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "default",
						className: "min-h-11 w-full md:w-auto",
						"data-grove-action": "regen",
						"aria-label": "New specimen",
						title: "Same start, different life",
						onPointerUp: handleGrovePointer,
						onClick: handleGrovePointer,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, {}), "New"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grove-stage",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroveCanvas, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grove-chrome grove-panel p-3 pb-16 md:p-4 md:pb-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto w-full md:mx-0 md:max-w-96",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlPanel, {})
				})
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroveApp, {});
}
//#endregion
export { Home as component };
