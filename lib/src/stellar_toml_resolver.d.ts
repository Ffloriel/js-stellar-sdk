import { StellarTomlResolverOptions } from '@/types/';
export declare const STELLAR_TOML_MAX_SIZE: number;
/**
 * StellarTomlResolver allows resolving `stellar.toml` files.
 */
export declare class StellarTomlResolver {
    static resolve(domain: string, opts?: StellarTomlResolverOptions): Promise<any>;
}
