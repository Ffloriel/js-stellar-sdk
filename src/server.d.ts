export type ServerOptions = {
  // Allow connecting to http servers, default: `false`. This must be set to false in production deployments!
  allowHttp?: boolean;
}

export type Timebounds = {
  minTime: number;
  maxTime: number;
}

export type Link = {
  // The URI of the link
  href: string;
  // Whether the link is templated
  templated: boolean;
}