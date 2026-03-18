import fs from "fs";
import { error, json } from "@sveltejs/kit";
import moment from "moment";

import { LOGS_PATH } from "$env/static/private";

export async function POST({ request, url }): Promise<Response> {
  const { pathname } = url;

  if (pathname.match(/\/(failed|success)$/)) {
    const requestJson = await request.json();

    const path = LOGS_PATH || "/";
    const code = requestJson.code || 0;

    let reason = "";

    if (pathname.match(/\/failed$/)) {
      switch (code) {
        case 7000:
          reason = "invalid file";
          break;
        case 7001:
          reason = "file size is 0";
          break;
        case 7002:
          reason = "region not found";
          break;
        default:
          reason = "?";
      }
    }

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
