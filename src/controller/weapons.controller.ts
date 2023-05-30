import { Request, Response } from "express";
import Weapons from "../model/weapons.model";
import Endpoint from "../model/endpoint.model";
import IWeapons from "../interface/weapons.interface";

export const getAllWeapons = async ({ query }: Request, res: Response) => {
  try {
    const getAll = await Weapons.find(query);
    if (getAll) return res.status(200).json({ status: 200, weapons: getAll });
    return res
      .status(404)
      .json({ status: 404, message: "Not found weapons list" });
  } catch (error) {
    return res.status(400).json({ status: 400, error_message: error });
  }
};

export const getWeaponByID = async (_: Request, res: Response) => {
  try {
    const findByID = await Weapons.findById(res.locals.id);
    if (!findByID)
      return res.status(404).json({ message: "Weapons not found" });
    return res.status(200).json(findByID);
  } catch (error) {
    return res.status(400).json({ status: 400, error_message: error });
  }
};

export const createWeapon = async ({ body }: Request, res: Response) => {
  try {
    const newWeaponsBody: IWeapons = body;
    const newWeapons = await Weapons.create(newWeaponsBody);
    if (newWeapons) {
      await Endpoint.findOneAndUpdate(
        { title: "Weapons" },
        { counter: await Weapons.countDocuments() }
      );
      return res.status(201).json(newWeapons);
    }
    return res.status(400).json({
      error_message: "Error to creating weapons...Invalid key(s) or value(s)",
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      error_message: error,
    });
  }
};

export const updateWeapon = async ({ body }: Request, res: Response) => {
  const id = res.locals.id;
  // Destrutturazione del body
  const primitiveData: IWeapons = body;
  try {
    const weaponsToUpdate = await Weapons.findByIdAndUpdate(
      id,
      { $set: primitiveData },
      { new: true, runValidators: true, useFindAndModify: false }
    );
    if (weaponsToUpdate) return res.status(200).json(weaponsToUpdate);
    return res.status(404).json({
      status: 404,
      error_message: "Error weapons to update not found",
    });
  } catch (error) {
    return res.status(400).json({ error_message: error });
  }
};

export const deleteWeapon = async (_: Request, res: Response) => {
  try {
    const weaponsToDelete = await Weapons.findByIdAndDelete(res.locals.id);
    if (!weaponsToDelete)
      return res.status(404).json({ error: "Weapons not found" });
    await Endpoint.findOneAndUpdate(
      { title: "Weapons" },
      { counter: await Weapons.countDocuments() }
    );
    return res.status(200).json({
      status: 200,
      message: `Weapons with id = ${res.locals.id} has been deleted`,
    });
  } catch (error) {
    res.status(400).json({ error_message: error });
  }
};
