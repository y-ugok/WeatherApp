import 'https://deno.land/std/dotenv/load.ts';

Deno.serve(async (req) => {
  const { searchParams } = new URL(req.url);
  const func = searchParams.get('func');

  const apikey = Deno.env.get('APIKEY');
  // console.log(func + apikey);
  const apipath = 'https://api.openweathermap.org/data/2.5';

  let res;
  if (func == 'forecast') {
    const q = searchParams.get('q');
    const url = `${apipath}/${func}?q=${q}&lang=ja&appid=${apikey}`;
    res = await fetch(url);
  } else {
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const url = `${apipath}/${func}?lat=${lat}&lon=${lon}&lang=ja&appid=${apikey}`;
    res = await fetch(url);
  }
  const obj = await res.json();

  // console.log(JSON.stringify(obj, null, 2));
  const body = JSON.stringify(obj);

  return new Response(body, {
    headers: {
      // 'Access-Control-Allow-Origin': '*', // ここも忘れずに修正
      'Access-Control-Allow-Origin': 'https://y-ugok.github.io',
      'content-type': 'application/json; charset=utf-8',
    },
  });
});
