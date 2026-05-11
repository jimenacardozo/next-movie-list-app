import { z } from "zod"

export const AddMovieSchema = z.object({
  movieId: z.number().int().positive(),
})
