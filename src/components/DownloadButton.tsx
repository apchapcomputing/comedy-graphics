import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

interface DownloadButtonProps {
  targetId: string;
  filename?: string;
}

const DownloadButton = ({ targetId, filename = "comedy-flyer" }: DownloadButtonProps) => {
  const { toast } = useToast();

  const downloadAsImage = async () => {
    try {
      const element = document.getElementById(targetId);
      if (!element) {
        toast({
          title: "Error",
          description: "Could not find the flyer to download",
          variant: "destructive",
        });
        return;
      }

      // Show loading state
      toast({
        title: "Generating image...",
        description: "Please wait while we create your flyer image",
      });

      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast({
            title: "Success!",
            description: "Your flyer has been downloaded successfully",
          });
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Download failed",
        description: "There was an error generating your flyer image",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={downloadAsImage}
      className="bg-gradient-energy hover:scale-105 transition-all duration-300 shadow-comedy"
      size="lg"
    >
      <Download className="w-4 h-4 mr-2" />
      Download PNG
    </Button>
  );
};

export default DownloadButton;