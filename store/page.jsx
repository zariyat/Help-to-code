import React from "react";
import Layout from "../../../../components/admin/Layout/Layout";
import StoreComp from "../../../../components/admin/store/Store";

import db from "../../../../utils/db";
import {
  filterArray,
  randomize,
  removeDuplicates,
} from "../../../../utils/Array";

import Store from "../../../../model/Store";
import User from "../../../../model/User";
import Category from "../../../../model/Category";
import SubCategory from "../../../../model/SubCategory";

import { getCurrentUser } from "../../../../utils/session";
import { redirect } from "next/navigation";

async function getData({ params, searchParams }) {
  db.connectDb();

  const session = await getCurrentUser();
  if (!session) {
    redirect("/signin");
  }
  const page = searchParams.page || 1;

  const sortQuery = searchParams.sort || "";
  const pageSize = 10;
  let Stores;
  const sort =
    sortQuery == ""
      ? {}
      : sortQuery == "pending"
      ? { storeAtive: "pending" }
      : sortQuery == "active"
      ? { storeAtive: "active" }
      : sortQuery == "ban"
      ? { storeAtive: "ban" }
      : sortQuery == "block"
      ? { storeAtive: "block" }
      : {};

  console.log("this is sort", sort);
  if (session?.role === "admin") {
    // If the user is an admin, fetch all stores
    Stores = await Store.find({ ...sort })
      .populate({
        path: "owner",
        model: User,
      })
      .populate({
        path: "category",
        model: Category,
      })
      .populate({
        path: "subCategories",
        model: SubCategory,
      })
      .skip(pageSize * (page - 1))

      .limit(pageSize);

    Stores = sortQuery && sortQuery !== "" ? Stores : randomize(Stores);
  } else {
    // If the user is not an admin, fetch only their store
    Stores = await Store.find({ owner: session.id })
      .populate({
        path: "owner",
        model: User,
      })
      .populate({
        path: "category",
        model: Category,
      })
      .populate({
        path: "subCategories",
        model: SubCategory,
      });
  }
  let totalProducts = await Store.countDocuments({});
  return {
    Stores: JSON.parse(JSON.stringify(Stores)),
    paginationCount: Math.ceil(totalProducts / pageSize),
  };
}

export default async function page({ searchParams }) {
  const { Stores, paginationCount } = await getData({ searchParams });
  return (
    <Layout>
      <StoreComp Stores={Stores} paginationCount={paginationCount} />
    </Layout>
  );
}
