import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import TariffDetailClient from "@/components/TariffDetailClient";

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/tariff`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return {
        title: "Tariff Not Found - Vinushree Tours & Travels",
      };
    }
    
    const data = await response.json();
    const tariff = data.success ? data.data.find((t: any) => t.slug === slug) : null;
    
    if (!tariff) {
      return {
        title: "Tariff Not Found - Vinushree Tours & Travels",
      };
    }
    
    return {
      title: tariff.seoTitle || `${tariff.vehicleName} - Tariff & Pricing | Vinushree Tours & Travels`,
      description: tariff.seoDescription || `Book ${tariff.vehicleName} for your travel needs. One-way: ₹${tariff.oneWayRate}/km, Round trip: ₹${tariff.roundTripRate}/km. Professional drivers and clean vehicles.`,
      keywords: tariff.seoKeywords || `${tariff.vehicleName}, ${tariff.vehicleType}, taxi booking, travel tariff, Tamil Nadu taxi`,
    };
  } catch (error) {
    return {
      title: "Tariff Not Found - Vinushree Tours & Travels",
    };
  }
}

// Fetch tariff data
async function getTariffData(slug: string) {
  try {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/tariff`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tariff data');
    }
    
    const data = await response.json();
    const tariff = data.success ? data.data.find((t: any) => t.slug === slug) : null;
    
    return tariff;
  } catch (error) {
    console.error('Error fetching tariff data:', error);
    return null;
  }
}

export default async function TariffDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tariffData = await getTariffData(slug);

  if (!tariffData) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <TariffDetailClient tariffData={tariffData} />
      <Footer />
      <FloatingContactButtons />
    </div>
  );
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/tariff`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const tariffs = data.success ? data.data : [];
    
    return tariffs.map((tariff: any) => ({
      slug: tariff.slug,
    }));
  } catch (error) {
    return [];
  }
}