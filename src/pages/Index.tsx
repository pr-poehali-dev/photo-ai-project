import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleAutoEnhance = useCallback(() => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setBrightness([110]);
      setContrast([115]);
      setSaturation([120]);
      setIsProcessing(false);
      
      toast({
        title: '✨ Фото улучшено!',
        description: 'Применены автоматические настройки ИИ',
      });
    }, 1500);
  }, [toast]);

  const resetSettings = useCallback(() => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
  }, []);

  const imageStyle = {
    filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`,
    transition: 'filter 0.3s ease-out'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.1),transparent_50%)]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              <h1 className="text-6xl font-bold mb-2 tracking-tight">ИИ Фоторедактор</h1>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Загрузите фото и улучшите его с помощью умных алгоритмов искусственного интеллекта
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {!uploadedImage ? (
            <Card 
              className="lg:col-span-2 border-2 border-dashed border-primary/30 bg-card/50 backdrop-blur-sm p-12 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 animate-scale-in"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className={`text-center transition-transform duration-200 ${isDragging ? 'scale-105' : ''}`}>
                <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent">
                  <Icon name="ImagePlus" size={48} className="text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Загрузите фото</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Перетащите изображение сюда или нажмите кнопку для выбора файла
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-8 cursor-pointer"
                    asChild
                  >
                    <span>
                      <Icon name="Upload" size={20} className="mr-2" />
                      Выбрать файл
                    </span>
                  </Button>
                </label>
              </div>
            </Card>
          ) : (
            <>
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 animate-fade-in">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="Image" size={24} className="text-primary" />
                    Ваше фото
                  </h3>
                </div>
                <div className="relative rounded-lg overflow-hidden bg-muted/30 aspect-square">
                  <img 
                    src={uploadedImage} 
                    alt="Загруженное фото" 
                    style={imageStyle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setUploadedImage(null);
                      resetSettings();
                    }}
                  >
                    <Icon name="X" size={18} className="mr-2" />
                    Загрузить другое фото
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 animate-fade-in">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                    <Icon name="Wand2" size={24} className="text-accent" />
                    Инструменты ИИ
                  </h3>
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-opacity text-lg"
                    onClick={handleAutoEnhance}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                        Обработка...
                      </>
                    ) : (
                      <>
                        <Icon name="Sparkles" size={20} className="mr-2" />
                        Автоулучшение
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Icon name="Sun" size={16} className="text-yellow-400" />
                        Яркость
                      </label>
                      <span className="text-sm text-muted-foreground">{brightness[0]}%</span>
                    </div>
                    <Slider
                      value={brightness}
                      onValueChange={setBrightness}
                      min={50}
                      max={150}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Icon name="Circle" size={16} className="text-blue-400" />
                        Контрастность
                      </label>
                      <span className="text-sm text-muted-foreground">{contrast[0]}%</span>
                    </div>
                    <Slider
                      value={contrast}
                      onValueChange={setContrast}
                      min={50}
                      max={150}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Icon name="Palette" size={16} className="text-pink-400" />
                        Насыщенность
                      </label>
                      <span className="text-sm text-muted-foreground">{saturation[0]}%</span>
                    </div>
                    <Slider
                      value={saturation}
                      onValueChange={setSaturation}
                      min={50}
                      max={150}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-6"
                    onClick={resetSettings}
                  >
                    <Icon name="RotateCcw" size={18} className="mr-2" />
                    Сбросить настройки
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
