// 目标url，10-03增加了/v1beta，即不再需要反代url后面手动加/v1beta
const TELEGRAPH_URL = 'https://generativelanguage.googleapis.com/v1beta';

// 监听
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


async function handleRequest(request) {
// URL替换
  const url = new URL(request.url);
  url.host = TELEGRAPH_URL.replace(/^https?:\/\//, '');
  
  // 路径检查-已移除
  if (1) {
    // 获取 URL 中的 API 密钥
    const apiKeys = getApiKeys(url);
    if (apiKeys.length > 0) {
      // 随机选择apiKey
      const selectedKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
      url.searchParams.set('key', selectedKey);
    }
  }

 
  const modifiedRequest = new Request(url.toString(), {
    headers: request.headers,
    method: request.method,
    body: request.body,
    redirect: 'follow'
  });

  // 发送请求
  const response = await fetch(modifiedRequest);
  // Response处理
  const modifiedResponse = new Response(response.body, response);
  // 跨域允许
  modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
  
  // 返回响应
  return modifiedResponse;
}

// 提取 API
function getApiKeys(url) {
  // 使用key作为关键词开始查询
  const keyParam = url.searchParams.get('key');
  if (!keyParam) {
    
    return [];
  }
  // 使用正则表达式安全地分割密钥，支持多个密钥（以分号分隔）
  // 如果只有一个密钥，则返回包含该密钥的数组
  return keyParam.match(/([^;]+)/g) || [keyParam];
}
