"use client";

import { useState,useEffect,useRef } from "react";
import html2canvas from "html2canvas";
import { ClipLoader } from "react-spinners";
import { Card, CardContent, CardHeader , CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import Draggable from "react-draggable";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type Meme = {
    id: string;
    name: string;
    url: string;
}

type Position = {
    x : number;
    y : number;
}

const MemeGenerator = () => {
  // State to manage the list of memes
  const [memes,setMemes] = useState<Meme[]>([]);
  // State to manage the visible memes in the carousel
  const [visibleMemes,setVisibleMemes] = useState<Meme[]>([]);
  // State to manage the selected meme
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  // State to manage the text input by the user
  const [text,setText] = useState<string>("");
  // State to manage the position of the text
  const [textPosition,setTextPosition] = useState<Position>({x:0,y:0});
  // State to manage the loading state
  const [loading,setLoading] = useState<boolean>(true);
  // State to manage the loading state for loading more memes
  const [moreLoading,setMoreLoading] = useState<boolean>(false);
  // Reference to the meme div for taking a screenshot
  const memeRef = useRef<HTMLDivElement>(null);
  // Number of memes to load at a time
  const memesPerLoad = 4;

  // useEffect to fetch memes from the API when the component mounts
  useEffect(()=>{
    const fetchMemes = async () => {
        setLoading(true);
        const response = await fetch("https://api.imgflip.com/get_memes");
        const data = await response.json();
        setMemes(data.data.memes);
        setVisibleMemes(data.data.memes.slice(0,memesPerLoad));
        setLoading(false);
    }
    fetchMemes();
  },[])

  // Function to load more memes into the carousel
  const loadMoreMemes = (): void =>{
    setMoreLoading(true);
    const newVisibleMemes = memes.slice(0, visibleMemes.length + memesPerLoad);
    setVisibleMemes(newVisibleMemes);
    setMoreLoading(false);
  }

  // Function to handle downloading the meme as an image
  const handleDownload = async (): Promise<void> => {
     if(memeRef.current) {
        const canvas = await html2canvas(memeRef.current);
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "meme.png";
        link.click();
     }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="max-w-4xl w-full px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8">
            {/* Header section */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">
                    Meme Generator
                </h1>
                <p className="text-muted-foreground">
                Create custom memes with our easy-to-use generator.
                </p>
            </div>
            {/* Loading spinner or meme carousel */}
            {loading ? (
                <ClipLoader className="w-12 h-12 text-blue-500" />
            ) : (
                <>
              {/* Meme carousel */}
                 <div className="w-full overflow-x-scroll whitespace-nowrap py-2">
                    {visibleMemes.map((meme) => (
                        <Card
                        key={meme.id}
                        className="inline-block bg-muted rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 px-2"
                        onClick={() => setSelectedMeme(meme)}
                        >
                        <Image
                        src={meme.url}
                        alt={meme.name}
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                        />
                        <CardContent>
                            <p className="text-center">{meme.name}</p>
                        </CardContent>
                        </Card>
                    ))}
                 </div>
                {/* Load more memes button */}
                 {visibleMemes.length < memes.length && (
                    <Button
                    onClick={loadMoreMemes}
                    className="mt-4"
                    disabled={moreLoading}
                    >
                      {moreLoading ? (
                        <ClipLoader className="w-6 h-6 text-white"  />
                      ) : (
                        "Load More"
                      )}  
                    </Button>
                 )}
                {/* Meme customization section */}
                {selectedMeme && (
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>
                                Customize Your Meme
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                            ref={memeRef}
                            className="relative bg-muted rounded-lg overflow-hidden"
                            >
                              <Image
                              src={selectedMeme.url}
                              alt={selectedMeme.name}
                              width={300}
                              height={300}
                              className="object-cover w-full h-full"
                              />
                              <Draggable
                              position={textPosition}
                              onStop={(_,data) => {
                                setTextPosition({x: data.x, y:data.y});
                              }}
                              >
                               <div 
                               className="absolute text-black text-xl font-bold" 
                               style={{left:textPosition.x, top:textPosition.y}}
                               >
                                {text}
                               </div>
                              </Draggable>
                            </div>
                            <div>
                                {/* Text input for adding meme text */}
                                <Label htmlFor="meme-text" >Add Your Text</Label>
                                <Textarea
                                id="meme-text"
                                placeholder="Enter your meme text"
                                className="mt-1 w-full"
                                rows={3}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                />
                            </div>
                            <Button className="w-full mt-4" onClick={handleDownload}>
                                Download Meme
                            </Button>
                        </CardContent>
                    </Card>
                )}
                </> 
            )
        }
        </div>
      </div>
    </div>
  )
}

export default MemeGenerator
