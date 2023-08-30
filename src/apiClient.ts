import { Api } from "@/api-client/Api";

const apiClient = new Api({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL });

export default apiClient;
