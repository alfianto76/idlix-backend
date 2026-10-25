"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalCache = exports.CacheService = void 0;
const lru_cache_1 = require("lru-cache");
class CacheService {
    cache;
    constructor(maxItems = 1000, defaultTtlMs = 15 * 60 * 1000) {
        this.cache = new lru_cache_1.LRUCache({
            max: maxItems,
            ttl: defaultTtlMs,
        });
    }
    get(key) {
        return this.cache.get(key);
    }
    set(key, value, ttlMs) {
        if (ttlMs !== undefined) {
            this.cache.set(key, value, { ttl: ttlMs });
        }
        else {
            this.cache.set(key, value);
        }
    }
    has(key) {
        return this.cache.has(key);
    }
    delete(key) {
        return this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
}
exports.CacheService = CacheService;
exports.globalCache = new CacheService();
