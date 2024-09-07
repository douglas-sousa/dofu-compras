import Home from "@/components/templates/Home";

/* eslint-disable max-len */
const FAKE_ITEMS = [
    {
        title: "Modern Frozen Fish",
        description: "Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals",
        date: new Date("2024, 02, 02"),
        id: 1,
        images: [
            "https://images.pexels.com/photos/10152063/pexels-photo-10152063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "https://images.pexels.com/photos/351283/pexels-photo-351283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "https://images.pexels.com/photos/25584127/pexels-photo-25584127/free-photo-of-a-cup-of-coffee-sits-on-a-white-stool.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        ]
    },
    {
        title: "Unbranded Granite Pizza",
        description: "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J",
        date: new Date("2024, 03, 07"),
        id: 2,
        images: [
            "https://images.pexels.com/photos/10152063/pexels-photo-10152063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        ]
    },
    {
        title: "Bespoke Cotton Keyboard",
        description: "Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support",
        date: new Date("2024, 03, 20"),
        id: 3,
        images: [
            "https://images.pexels.com/photos/10152063/pexels-photo-10152063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        ]
    },
    {
        title: "Refined Metal Pants",
        description: "The Apollotech B340 is an affordable wireless mouse",
        date: new Date("2024, 06, 10"),
        id: 4,
        images: [
            "https://images.pexels.com/photos/10152063/pexels-photo-10152063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        ]
    },
    {
        title: "Electronic Fresh Hat",
        description: "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients\n\nThe beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients",
        date: new Date("2024, 08, 02"),
        id: 5,
        images: [
            "https://images.pexels.com/photos/10152063/pexels-photo-10152063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        ]
    }
];

export default async function App () {
    return (
        <Home posts={FAKE_ITEMS} />
    );
}