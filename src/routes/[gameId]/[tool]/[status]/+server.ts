import fs from "fs";
import { error, json } from "@sveltejs/kit";
import moment from "moment";

import { LOGS_PATH } from "$env/static/private";

export async function POST({ request, url }): Promise<Response> {
  const { pathname } = url;

  if (pathname.match(/\/(failed|success)$/)) {
    const requestJson = await request.json();

    const path = LOGS_PATH || "/";
    const reason = requestJson.reason || "";

    fs.appendFileSync(
      `${path}logs_${moment().format("YYYY-MM-DD")}.csv`,
      `${moment().format("YYYY-MM-DD HH:mm:ss")};${url.pathname};${reason}\n`,
    );

    return json({});
  }

  return error(404, {
    message: "Not found",
  });
}
