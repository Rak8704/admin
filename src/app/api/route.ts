import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "API endpoints documentation",
    endpoints: {
      auth: {
        login: "POST /api/auth/callback/credentials",
      },
      users: {
        getAll: "GET /api/users",
        getById: "GET /api/users/[id]",
        suspend: "PUT /api/users/[id]/suspension",
      },
      subAdmins: {
        create: "POST /api/sub-admins",
        getAll: "GET /api/sub-admins",
        update: "PUT /api/sub-admins/[id]",
        delete: "DELETE /api/sub-admins/[id]",
      },
      payments: {
        deposits: {
          getAll: "GET /api/payment/deposits",
          approveReject: "PUT /api/payment/deposits",
        },
        wallets: {
          getAll: "GET /api/payment/wallet",
          create: "POST /api/payment/wallet",
          update: "PUT /api/payment/wallet/[id]",
          delete: "DELETE /api/payment/wallet/[id]",
        },
        withdrawals: {
          getAll: "GET /api/payment/withdraws",
          approveReject: "PUT /api/payment/withdraws",
        },
      },
      dashboard: {
        overview: "GET /api/dashboard/overview",
      },
      siteSettings: {
        get: "GET /api/site-settings",
        update: "PUT /api/site-settings",
      },
      addBalance: {
        add: "POST /api/add-balance",
      },
      chat: {
        send: "POST /api/chat",
      },
      fileUpload: {
        uploadImages: "POST /api/upload-images",
        signCloudinary: "POST /api/sign-cloudinary",
      },
    },
  });
}