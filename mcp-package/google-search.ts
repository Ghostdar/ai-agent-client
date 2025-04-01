import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from 'axios';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
const server = new McpServer({
    name: "website-search",
    version: "1.0.0",
});

const transport = new StdioServerTransport();

const GOOGLE_API_KEY="AIzaSyBLZaPODUbER5qOc8tJSotyrlPRlD3_Crk"
const GOOGLE_CSE_ID="1492cf97e66534931"

// 错误类
class GoogleSearchError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GoogleSearchError';
    }
}

// 搜索结果项接口
interface GoogleSearchResultItem {
    title: string;
    link: string;
    snippet: string;
    displayLink: string;
    pagemap?: {
        cse_thumbnail?: Array<{
            src: string;
            width: string;
            height: string;
        }>;
        metatags?: Array<Record<string, string>>;
    };
}

// 搜索响应接口
interface GoogleSearchResponse {
    items?: GoogleSearchResultItem[];
    searchInformation?: {
        totalResults: string;
        searchTime: number;
        formattedSearchTime: string;
        formattedTotalResults: string;
    };
    error?: {
        code: number;
        message: string;
    };
}

// 格式化的搜索结果
export interface FormattedSearchResult {
    title: string;
    link: string;
    snippet: string;
    source: string;
}

// 格式化的搜索响应
export interface FormattedSearchResponse {
    results: FormattedSearchResult[];
    totalResults: string;
    searchTime: string;
    error?: string;
}

/**
 * 执行Google搜索
 * @param query 搜索查询字符串
 * @param numResults 返回结果数量，默认为5
 * @returns 格式化的搜索结果
 */
export async function performGoogleSearch(
    query: string,
    numResults = 5,
) {
    // 检查API密钥和搜索引擎ID是否配置
    if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
        return {
            content: [{ type: "text", text: '缺少Google搜索API配置，请设置GOOGLE_API_KEY和GOOGLE_CSE_ID环境变量' }]
        }
    }

    try {
        // 构建搜索URL
        const url = 'https://www.googleapis.com/customsearch/v1';

        // 发送请求
        const response = await axios.get<GoogleSearchResponse>(url, {
            params: {
                key: GOOGLE_API_KEY,
                cx: GOOGLE_CSE_ID,
                q: query,
                num: numResults > 10 ? 10 : numResults, // Google API最多允许10个结果
            },
        });

        const data = response.data;


        // 处理错误响应
        if (data.error) {
            return {
                content: [{ type: "text", text: `Google API错误: ${data.error.code} - ${data.error.message}` }]
            }
        }

        // 格式化结果
        const formattedResults: FormattedSearchResult[] = data.items?.map(item => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet,
            source: item.displayLink,
        })) || [];

        console.log("获取格式化结果", formattedResults);


        return {
            content: [{ type: "text", text: `Google搜索结果: ${JSON.stringify(formattedResults)}` }]
        };
    } catch (error) {
        // 错误处理
        if (error instanceof GoogleSearchError) {
            return {
                content: [{ type: "text", text: `Google API错误: ${error.message}` }]
            }
        }

        if (axios.isAxiosError(error)) {
            return {
                content: [{ type: "text", text: `Google API错误: ${error.response?.data.error.code} - ${error.response?.data.error.message}` }]
            }
        }

        return {
            content: [{ type: "text", text: `搜索过程中发生错误: ${error instanceof Error ? error.message : String(error)}` }]
        }
    }
}


server.tool(
    "google-search",
    "Search the web for information",
    { query: z.string() },
    async ({ query }) => {
        const result = await performGoogleSearch(query);
        return result as any;
    }
);

server.connect(transport);
