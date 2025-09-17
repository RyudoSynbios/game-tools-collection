import { error, json } from "@sveltejs/kit";
import moment from "moment";

export async function POST({ request, url }): Promise<Response> {
  const { pathname } = url;

  const reason = await request.json();

  if (pathname.match(/\/(failed|success)$/)) {
    console.log(moment().format("YYYY-MM-DD HH:mm:ss"), url.pathname, reason);

    return json({});
  }

  return error(404, {
    message: "Not found",
  });
}
