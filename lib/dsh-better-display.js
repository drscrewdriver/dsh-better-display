import { spawn } from "node:child_process";
import { scanGenerativeMcpappsStatus } from "./skill-roots.ts";
import { skillsFromListResult, toPublicSkillStatus } from "./skill-status.ts";
//#region src/dsh-better-display.ts
const name = "dsh-better-display";
const inject = ["webServer"];
function writeJson(res, status, body) {
	res.setHeader("Content-Type", "application/json");
	res.statusCode = status;
	res.end(JSON.stringify(body));
}
function skillLister(ctx) {
	const skills = ctx.get?.("skills");
	if (typeof skills?.list !== "function") return void 0;
	return async () => skillsFromListResult(await skills.list({}));
}
function apply(ctx) {
	console.log("[my-plugins/dsh-better-display] loaded");
	if (ctx.webServer) ctx.effect(() => {
		const disposeReveal = ctx.webServer.register({
			kind: "exact",
			path: "/better-display/reveal",
			handler: async (req, res) => {
				if (req.method !== "POST") {
					res.statusCode = 405;
					res.end();
					return;
				}
				let body = "";
				req.on("data", (chunk) => {
					body += chunk;
				});
				req.on("end", () => {
					try {
						const data = JSON.parse(body);
						const targetPath = typeof data.path === "string" ? data.path.trim() : "";
						if (!targetPath) {
							res.statusCode = 400;
							res.end(JSON.stringify({
								ok: false,
								error: "Empty path"
							}));
							return;
						}
						if (process.platform === "darwin") spawn("open", ["-R", targetPath], {
							detached: true,
							stdio: "ignore"
						});
						else if (process.platform === "win32") spawn("explorer.exe", [`/select,${targetPath}`], {
							detached: true,
							stdio: "ignore"
						});
						else spawn("xdg-open", [targetPath], {
							detached: true,
							stdio: "ignore"
						});
						res.setHeader("Content-Type", "application/json");
						res.statusCode = 200;
						res.end(JSON.stringify({ ok: true }));
					} catch (err) {
						res.statusCode = 400;
						res.end(JSON.stringify({
							ok: false,
							error: String(err)
						}));
					}
				});
			}
		});
		const disposeSkill = ctx.webServer.register({
			kind: "exact",
			path: "/better-display/skill-status",
			handler: async (req, res) => {
				if (req.method !== "GET") {
					res.statusCode = 405;
					res.end();
					return;
				}
				try {
					const cwd = new URL(req.url ?? "", "http://127.0.0.1").searchParams.get("cwd") ?? void 0;
					const status = await scanGenerativeMcpappsStatus({
						cwd,
						listSkills: skillLister(ctx)
					});
					writeJson(res, 200, toPublicSkillStatus(status));
				} catch (err) {
					writeJson(res, 500, {
						ok: false,
						error: String(err)
					});
				}
			}
		});
		return () => {
			disposeReveal();
			disposeSkill();
		};
	}, "dsh-better-display: reveal and skill-status routes");
}
//#endregion
export { apply, inject, name };
