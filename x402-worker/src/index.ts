--- a/x402-worker/src/index.ts
+++ b/x402-worker/src/index.ts
@@
 import { Hono } from "hono";
 import { paymentMiddleware, x402ResourceServer } from "@x402/hono";
 
+// Initialize the Hono application
+const app = new Hono();
+
+// Apply the payment middleware to all routes
+app.use("*", paymentMiddleware());
+
+// Mount the X402 resource server router at the root path
+app.route("/", x402ResourceServer);
+
+// Export the Hono app for Cloudflare Workers and test environments
+export default app;
