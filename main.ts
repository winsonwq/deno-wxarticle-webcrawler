import { fetchPage } from "./fetchPage.ts";

/**
 * 公开的 API 服务
 * 提供 HTTP 接口来抓取微信公众号文章
 */
async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  // 处理 CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 只允许 GET 和 POST 请求
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    let articleUrl: string | null = null;

    // 从查询参数或请求体中获取 URL
    if (req.method === 'GET') {
      articleUrl = url.searchParams.get('url');
    } else if (req.method === 'POST') {
      const body = await req.json();
      articleUrl = body.url;
    }

    // 验证 URL
    if (!articleUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing url parameter' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 验证 URL 格式
    try {
      new URL(articleUrl);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 调用 fetchPage 函数
    const articleJson = await fetchPage(articleUrl);
    const article = JSON.parse(articleJson);

    // 返回成功响应
    return new Response(
      JSON.stringify({
        success: true,
        data: article,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching page:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

// 启动服务器
const port = Deno.env.get('PORT') ? parseInt(Deno.env.get('PORT')!) : 8000;

console.log(`🚀 API 服务启动在 http://localhost:${port}`);
console.log(`📖 使用示例: GET http://localhost:${port}/api?url=<文章URL>`);
console.log(`📖 或 POST http://localhost:${port}/api 请求体: {"url": "<文章URL>"}`);

Deno.serve({ port }, handler);

