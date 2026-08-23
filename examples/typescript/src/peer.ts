import { A2APeer } from "marona";

export function createPeer(url = process.env.A2A_PEER_URL ?? "http://127.0.0.1:8100"): A2APeer {
  const token = process.env.A2A_BEARER_TOKEN;
  return new A2APeer({
    name: "travel-planner",
    url,
    ...(token ? { authentication: { type: "bearer" as const, token } } : {}),
    permissions: ["travel.route.read"],
    policy: {
      allowedSkills: ["plan-travel"],
      deniedFields: ["payment_credentials", "identity_document"],
    },
  });
}

export async function callPeer(url?: string): Promise<unknown> {
  return createPeer(url).run(
    { origin: "Harare", destination: "Victoria Falls" },
    { skill: "plan-travel" },
  );
}

const isEntryPoint = process.argv[1] && import.meta.url === new URL(process.argv[1], "file:").href;
if (isEntryPoint) {
  callPeer().then((task) => console.log(JSON.stringify(task, null, 2))).catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}

