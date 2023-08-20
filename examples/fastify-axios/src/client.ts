import { makeAxiosClient } from "@pocket-rpc/axios";
import type { AppRouter } from "./server";

export const client = makeAxiosClient<AppRouter>().setBaseUrl(
    "http://localhost:3000/"
);

client.get("hello", {}).then((result) => {
    console.log(result);
});
