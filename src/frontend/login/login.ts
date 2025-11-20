async function start_oauth(): Promise<void> {
    console.log("Requesting Access!")

    const x = await fetch("/api/access", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({})
    })

    console.log("Access requested!");
}

start_oauth();