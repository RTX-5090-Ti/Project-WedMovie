// src/components/movie-detail/PlayerDialog.jsx
import { Dialog, DialogContent } from "@mui/material";

export default function PlayerDialog({ open, onClose, movie }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 0 }}>
        <div className="bg-black aspect-video">
          {movie?.trailer ? (
            <iframe
              src={movie.trailer}
              title={movie.title?.vi || movie.title?.en}
              className="w-full h-full"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white/50">
              Chưa có link phim
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
