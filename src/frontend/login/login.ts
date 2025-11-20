import {DEFAULT_URL} from "../../shared/config";

async function start_oauth(): Promise<void> {
    console.log("Requesting Access!")

    const url = new URL(window.location.href);

    const state = url.searchParams.get("state");
    const userId = url.searchParams.get("userId");

    if (!state || !userId) {
        window.location.href=`${DEFAULT_URL}/api/access`
        return;
    }

    window.location.href=`${DEFAULT_URL}/api/login/?state=${state}&userId=${userId}`;
}

start_oauth();