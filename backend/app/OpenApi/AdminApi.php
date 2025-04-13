<?php

namespace App\OpenApi;

/**
 * @OA\Tag(
 *     name="Admins",
 *     description="Operations related to Admin management."
 * )
 */
class AdminApi
{
    /**
     * @OA\Post(
     *     path="/api/admins",
     *     summary="Create or update an Admin record",
     *     description="Creates or updates an admin record. Only users with type 'Admin' are allowed.",
     *     tags={"Admins"},
     *     security={{"ApiKeyAuth": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Admin record details",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="department", type="string", example="IT"),
     *             @OA\Property(property="role_level", type="string", example="manager"),
     *             @OA\Property(property="is_super_admin", type="boolean", example=false)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Admin record updated successfully.",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Admin record updated successfully."),
     *             @OA\Property(property="admin", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized. Only Admin users can do this.",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Unauthorized. Only Admin users can do this.")
     *         )
     *     )
     * )
     */
    public function storeOrUpdate() {}

    /**
     * @OA\Get(
     *     path="/api/admins/{id}",
     *     summary="Retrieve a single Admin record",
     *     tags={"Admins"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the admin record",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Admin record retrieved successfully.",
     *         @OA\JsonContent(type="object")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Admin record not found."
     *     )
     * )
     */
    public function getAdminById() {}

    /**
     * @OA\Get(
     *     path="/api/admins",
     *     summary="Retrieve all Admin records",
     *     tags={"Admins"},
     *     @OA\Response(
     *         response=200,
     *         description="List of admin records retrieved successfully.",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(type="object")
     *         )
     *     )
     * )
     */
    public function listAdmins() {}

    /**
     * @OA\Delete(
     *     path="/api/admins/{id}",
     *     summary="Delete an Admin record",
     *     tags={"Admins"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the admin record to delete",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Admin record deleted successfully.",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Admin record deleted successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Admin record not found."
     *     )
     * )
     */
    public function deleteAdmin() {}

    /**
     * @OA\Put(
     *     path="/api/admins/{id}/stats",
     *     summary="Update or retrieve platform-wide stats for an Admin",
     *     tags={"Admins"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the admin record to update stats for",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         description="Optional parameters for stats update",
     *         @OA\JsonContent(
     *             type="object"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Admin stats updated successfully.",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Admin stats updated successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Admin record not found."
     *     )
     * )
     */
    public function updateAdminStats() {}
}
