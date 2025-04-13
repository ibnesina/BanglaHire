<?php

namespace App\OpenApi;

/**
 * @OA\Tag(
 *     name="Categories",
 *     description="Operations related to Category management."
 * )
 */
class CategoryApi
{
    /**
     * @OA\Get(
     *     path="/api/categories",
     *     summary="Retrieve all categories",
     *     tags={"Categories"},
     *     @OA\Response(
     *         response=200,
     *         description="List of categories retrieved successfully.",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(type="object")
     *         )
     *     )
     * )
     */
    public function listCategories() {}

    /**
     * @OA\Get(
     *     path="/api/categories/{id}",
     *     summary="Retrieve a single category",
     *     tags={"Categories"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the category",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Category retrieved successfully.",
     *         @OA\JsonContent(type="object")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Category not found."
     *     )
     * )
     */
    public function getCategoryById() {}

    /**
     * @OA\Post(
     *     path="/api/categories",
     *     summary="Create a new category",
     *     tags={"Categories"},
     *     security={{"ApiKeyAuth": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Category details",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="name", type="string", example="New Category"),
     *             @OA\Property(
     *                 property="skills",
     *                 type="array",
     *                 @OA\Items(type="string")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Category created successfully.",
     *         @OA\JsonContent(type="object")
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized.",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Unauthorized")
     *         )
     *     )
     * )
     */
    public function createCategory() {}

    /**
     * @OA\Put(
     *     path="/api/categories/{id}",
     *     summary="Update an existing category",
     *     tags={"Categories"},
     *     security={{"ApiKeyAuth": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the category to update",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Updated category details",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="name", type="string", example="Updated Category"),
     *             @OA\Property(
     *                 property="skills",
     *                 type="array",
     *                 @OA\Items(type="string")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Category updated successfully.",
     *         @OA\JsonContent(type="object")
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized.",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Unauthorized")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Category not found."
     *     )
     * )
     */
    public function updateCategory() {}

    /**
     * @OA\Delete(
     *     path="/api/categories/{id}",
     *     summary="Delete a category",
     *     tags={"Categories"},
     *     security={{"ApiKeyAuth": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the category to delete",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Category deleted successfully.",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Category deleted successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized.",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Unauthorized")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Category not found."
     *     )
     * )
     */
    public function deleteCategory() {}
}
