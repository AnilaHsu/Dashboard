import { baseURL } from "./constants"

export function getSSE(path) {
    const sse = new EventSource(baseURL + "")
    return sse
}