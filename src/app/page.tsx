"use client"
import JSConfetti from 'js-confetti'
import { Button } from "@/components/ui/button";
import { BetweenHorizonalStart, Check, Copy, Download, Info, Loader, Search, Sparkles, Table } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Image from "next/image";
function ImageCard({ image, prompt }: { image: string, prompt: string }) {
  const [copy, setCopy] = useState(false);

  const handleCopy = async () => {
    setCopy(true);
    console.log(prompt);
    await navigator.clipboard.writeText(prompt)
    setTimeout(() => {
      setCopy(false);
    }, 500);
  };


  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "downloaded-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <article
      className={`bg-[#f2f2f2] relative inset-0 bg-center bg-cover bg-no-repeat`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      <Info size={20} className="absolute bottom-1 left-1 text-[#5c5c5c] p-1 bg-white rounded-sm cursor-pointer border border-[#cecece]"></Info>
      {copy === false ? (
        <Copy
          onClick={handleCopy}
          size={18}
          className="absolute bottom-1 right-1 cursor-pointer text-white"
        />
      ) : (
        <Check
          size={18}
          className="absolute bottom-1 right-1 cursor-pointer text-white"
        />
      )}
      <Download
        onClick={handleDownload}
        size={18}
        className="absolute bottom-1 right-8 cursor-pointer text-white"
      ></Download>
    </article>
  );
}

export default function Home() {
  const [carousel, setCarousel] = useState("https://storage.sujjeee.com/images/gxngx12yd4.jpe")
  const [images, setImages] = useState<{ id: string, image: string, prompt: string }[]>([]);
  const [filteredImages, setfilteredImages] = useState<{ id: string, image: string, prompt: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const images = ["https://storage.sujjeee.com/images/ol2zrygn2g.jpeg",
      "https://storage.sujjeee.com/images/2k6migyopw.jpeg",
      "https://storage.sujjeee.com/images/xeetwuqaft.jpeg",
      "https://storage.sujjeee.com/images/t0tafz50nk.jpeg"]
    const intervalId = setInterval(() => {
      const imageIndex = Math.floor(Math.random() * images.length);
      setCarousel(images[imageIndex]);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [])
  useEffect(() => {
    setfilteredImages(
      images.filter(image => image.prompt.includes(search))
    );
  }, [search, images]);
  const handlePrompt = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget.elements
    const prompt = formElement.namedItem("prompt") as HTMLInputElement
    const headers = {
      'Authorization': `Bearer ${process.env.API_TOKEN}`,
      'Content-Type': 'application/json',
    };
    setIsLoading(true)
    fetch(`${process.env.API_URL}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(prompt.value),
    })
      .then(response => response.blob())
      .then(imageBlob => {
        const imageUrl = URL.createObjectURL(imageBlob);
        setImages((prevImage) => [
          ...prevImage,
          {
            id: imageUrl,
            image: imageUrl,
            prompt: prompt.value
          }
        ])
        setIsLoading(false)
        setIsDialogOpen(false);
        const jsConfetti = new JSConfetti()
        jsConfetti.addConfetti()
      })
      .catch(error => {
        setIsLoading(false)
        console.error('Error:', error)
      });
  }
  return (
    <main className="flex flex-col h-screen">
      {/* Barra fija superior */}
      <section className="p-2 flex items-center fixed w-full bg-white z-10">
        <div className="mr-3">
          <Button variant={"secondary"} className="rounded-r-none rounded-l-sm border border-[#ececec] h-8">
            <BetweenHorizonalStart size={18} className="text-[#949393]" />
          </Button>
          <Button variant={"secondary"} className="rounded-l-none rounded-r-sm border border-[#ececec] h-8">
            <Table size={18} className="text-[#949393]" />
          </Button>
        </div>
        <div className="flex items-center rounded-sm border-2 border-[#ececec] px-2 py-1 h-8">
          <Search size={18} className="text-[#dcdada] mr-2" />
          <input onChange={(e) => setSearch(e.target.value)} className="outline-none border-none caret-[#dcdada] text-[#c2c1c1]" type="text" />
        </div>
      </section>

      {/* Sección de imágenes */}
      <section className="flex-1 grid grid-cols-2 grid-rows-4 gap-[2px] p-2 pt-14 lg:grid-cols-6 overflow-y-auto">
        {
          filteredImages.map((image) => (
            <ImageCard key={image.id} image={image.image} prompt={image.prompt} />
          ))
        }
      </section>

      {/* Sección de diálogo */}
      <section className="absolute bottom-1 left-1">
        {/* Diálogo de generación de imagen */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger onClick={() => setIsDialogOpen(true)} asChild>
            <Button>
              <Sparkles size={18} className="text-white" />Generate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Make your own image</DialogTitle>
              <DialogDescription>
                Make text prompt to image with just one click.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePrompt} action="">
              <div className="grid gap-4 py-4">
                <Image className="w-full rounded-md" src={`${carousel}`} alt="" height={1000} width={1000} />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="prompt"
                    defaultValue="Type your prompt here"
                    className="col-span-4"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{isLoading ? (<Loader className="animate-spin" />) : <><Sparkles size={18} className="text-white" /><span>Do it!</span></>}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </section>
    </main>
  );
}
