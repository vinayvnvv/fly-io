export async function POST(request) {
  const body = await request.json();
  const response = await fetch(
    "https://oxide.sensibull.com/v1/compute/8/oi_graphs/oi_change_chart",
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        // Cookie: `_cfuvid=whmf.kdw0L1v.dKrrNjU2xjzbfDxOjd3xmkAPSEA8DI-1747811222443-0.0.1.1-604800000`,
      },
    }
  ).catch((err) => {
    console.log(err);
  });
  console.log("response", response);
  const res = await response.json();

  return new Response(JSON.stringify(res), {
    headers: { "Content-Type": "application/json" },
  });
}
