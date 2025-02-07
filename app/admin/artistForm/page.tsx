"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Artist } from "@/app/types/pokemon.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";

export default function ArtistCatalog() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [artists, setArtists] = useState<Artist[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState({
    pseudo: "",
    weight: "",
    height: "",
    city: "",
    country: "",
    title: "",
    description: "",
    picture_one: "",
    picture_two: "",
    picture_three: "",
    avatar1: "",
    avatar2: "",
  });

  // Effect for redirecting if not authenticated or not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Effect for fetching artists
  useEffect(() => {
    async function fetchArtists() {
      if (status === "authenticated" && session?.user?.role === "admin") {
        const response = await fetch("/api/artists");
        const data = await response.json();
        setArtists(data.artists);
      }
    }
    fetchArtists();
  }, [status, session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session?.user?.role !== "admin") {
    router.push("/auth/login");
    return null;
  }

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet artiste ?")) {
      await fetch(`/api/artists?id=${id}`, {
        method: "DELETE",
      });
      setArtists(artists.filter((artist) => artist.id !== id));
    }
  };

  const handleEdit = (artist: Artist) => {
    setIsEditing(true);
    setEditingArtist(artist);
    setFormData({
      ...artist,
      weight: artist.weight.toString(),
      height: artist.height.toString(),
    });
  };

  const handleAddNew = () => {
    setIsEditing(true);
    setEditingArtist(null);
    setFormData({
      pseudo: "",
      weight: "",
      height: "",
      city: "",
      country: "",
      title: "",
      description: "",
      picture_one: "",
      picture_two: "",
      picture_three: "",
      avatar1: "",
      avatar2: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingArtist ? "PUT" : "POST";
    const url = editingArtist
      ? `/api/artists?id=${editingArtist.id}`
      : "/api/artists";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const response = await fetch("/api/artists");
    const data = await response.json();
    setArtists(data.artists);

    setIsEditing(false);
    setEditingArtist(null);
  };

  return (
    <div className="pt-28 bg-black">
      <h1 className="text-3xl text-center">Catalogue des artistes</h1>

      <div className="flex flex-wrap justify-center gap-5">
        {artists.map((artist) => (
          <div key={artist.id} className="artistForm_card golden-border p-5">
            <strong>Images: </strong>
            <div className="artist-pictures flex flex-wrap gap-10">
              <div>
                {" "}
                <strong>Photo 1</strong>
                {artist.picture_one && (
                  <img
                    src={artist.picture_one}
                    alt={`${artist.pseudo} - ${artist.title} - Image 1`}
                    style={{ width: "200px", height: "auto" }}
                  />
                )}
              </div>

              <div>
                {" "}
                <strong>Photo 2</strong>
                {artist.picture_two && (
                  <img
                    src={artist.picture_two}
                    alt={`${artist.pseudo} - ${artist.title} - Image 2`}
                    style={{ width: "200px", height: "auto" }}
                  />
                )}
              </div>

              <div>
                {" "}
                <strong>Photo 3</strong>
                {artist.picture_three && (
                  <img
                    src={artist.picture_three}
                    alt={`${artist.pseudo} - ${artist.title} - Image 3`}
                    style={{ width: "200px", height: "auto" }}
                  />
                )}
              </div>
            </div>
            <strong>Avatars :</strong>
            <div className="flex py-5 gap-5">
              <div>
                <strong>Avatar 1</strong>
                {artist.avatar1 && (
                  <img
                    src={artist.avatar1}
                    alt={`${artist.pseudo} - ${artist.title} - Avatar 1`}
                    style={{ width: "150px", height: "auto" }}
                  />
                )}
              </div>
              <div>
                <strong>Avatar 2</strong>
                {artist.avatar2 && (
                  <img
                    src={artist.avatar2}
                    alt={`${artist.pseudo} - ${artist.title} - Avatar 2`}
                    style={{ width: "150px", height: "auto" }}
                  />
                )}
              </div>
            </div>
            <div className="artist-details flex flex-col gap-5">
              <p>
                <strong>Pseudo :</strong> {artist.pseudo}
              </p>
              <p>
                <strong>Ville(s) :</strong> {artist.city}
              </p>
              <p>
                <strong>Pays :</strong> {artist.country}
              </p>
              <p>
                <strong>Poids :</strong> {artist.weight} kg
              </p>
              <p>
                <strong>Taille :</strong> {artist.height} cm
              </p>
              <p>
                <strong>Titre :</strong> {artist.title}
              </p>
              <p>
                <strong>Description :</strong> {artist.description}
              </p>
            </div>

            <div className="flex gap-2 py-5">
              <button onClick={() => handleEdit(artist)}>Modifier</button>
              <button onClick={() => handleDelete(artist.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="col-span-full flex justify-center py-8">
        <button onClick={handleAddNew} className="text-center">
          Ajouter un nouvel artiste
        </button>
      </div>

      {isEditing && (
        <div>
          <h2 className="text-center text-2xl">
            {editingArtist ? "Modifier l'artiste" : "Ajouter un nouvel artiste"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
            <input
              type="text"
              placeholder="Pseudo"
              value={formData.pseudo}
              onChange={(e) =>
                setFormData({ ...formData, pseudo: e.target.value })
              }
              className="p-2"
              required
            />
            <input
              type="text"
              placeholder="Ville"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="p-2"
              required
            />
            <input
              type="text"
              placeholder="Pays"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className="p-2"
              required
            />
            <input
              type="number"
              placeholder="Poids"
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: e.target.value })
              }
              className="p-2"
              required
            />
            <input
              type="number"
              placeholder="Taille"
              value={formData.height}
              onChange={(e) =>
                setFormData({ ...formData, height: e.target.value })
              }
              className="p-2"
              required
            />
            <input
              type="text"
              placeholder="Titre"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="p-2"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="p-2"
              required
            />
            <input
              type="text"
              placeholder="Lien de la première image"
              value={formData.picture_one}
              onChange={(e) =>
                setFormData({ ...formData, picture_one: e.target.value })
              }
              className="p-2"
              required
            />
            <input
              type="text"
              placeholder="Lien de la deuxième image"
              value={formData.picture_two}
              onChange={(e) =>
                setFormData({ ...formData, picture_two: e.target.value })
              }
              className="p-2"
              required
            />
            <input
              type="text"
              placeholder="Lien de la troisième image"
              value={formData.picture_three}
              onChange={(e) =>
                setFormData({ ...formData, picture_three: e.target.value })
              }
              className="p-2"
              required
            />
            <input
              type="text"
              placeholder="Lien de l'avatar 1"
              value={formData.avatar1}
              onChange={(e) =>
                setFormData({ ...formData, avatar1: e.target.value })
              }
              className="p-2"
              required
            />
            <input
              type="text"
              placeholder="Lien de l'avatar 2"
              value={formData.avatar2}
              onChange={(e) =>
                setFormData({ ...formData, avatar2: e.target.value })
              }
              className="p-2"
              required
            />

            {/* Les autres inputs suivent la même logique */}
            <button type="submit">
              {editingArtist ? "Modifier" : "Ajouter"}
            </button>
            <button onClick={() => setIsEditing(false)}>Annuler</button>
          </form>
        </div>
      )}
    </div>
  );
}
